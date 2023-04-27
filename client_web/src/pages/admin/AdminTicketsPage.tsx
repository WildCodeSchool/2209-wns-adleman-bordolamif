import { useMutation, useQuery } from '@apollo/client';
import TicketsList from '@components/lists/TicketsList';
import TicketModal from '@components/modals/TicketModal';
import { UPDATE_TICKET } from '@graphQL/mutations/ticketMutations';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { GET_ALL_TICKETS } from '@graphQL/query/ticketQuery';
import { DateFilterObjectEnum } from '@utils/enum/objects/DateFilterObjectEnum';
import { StatusObjectEnum } from '@utils/enum/objects/StatusObjectEnum';
import useModal from '@utils/hooks/UseModal';
import { ServiceData, TicketData } from '@utils/types/DataTypes';
import { TicketInput } from '@utils/types/InputTypes';
import { useEffect, useState } from 'react';

function AdminTicketsPage() {
  const { isModalOpen, openModal, closeModal } = useModal();

  const [UpdateTicket] = useMutation(UPDATE_TICKET);

  const [ticketToUpdate, setTicketToUpdate] = useState<TicketData>();
  const [statusFilter, setStatusFilter] = useState<number>(1);
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [filteredTicketList, setFilteredTicketList] = useState<TicketData[]>([]);

  const {
    loading: ticketsListLoading,
    data: ticketsList,
    refetch: refetchTicketList,
  } = useQuery(GET_ALL_TICKETS, {
    variables: { filter: 'today' },
  });

  const {
    data: servicesList,
  } = useQuery(GET_ALL_SERVICES);

  const filterStatus = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(parseInt(e.target.value, 10));
  };

  const filterServices = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setServiceFilter(e.target.value);
  };

  const filterDate = (e:React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'all') {
      refetchTicketList({ filter: undefined });
    } else {
      refetchTicketList({ filter: e.target.value });
    }
  };

  const handleOpenModal = (ticket: TicketData) => {
    setTicketToUpdate(ticket);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleUpdateTicket = async (data:TicketInput, id:number) => {
    await UpdateTicket({ variables: { data, updateTicketId: id } });
    await refetchTicketList();
  };

  useEffect(() => {
    setFilteredTicketList(serviceFilter !== ''
      ? ticketsList?.getAllTickets
        .filter((ticket: TicketData) => ticket.service.name === serviceFilter)
        .filter((ticket: TicketData) => ticket.status === statusFilter)
      : ticketsList?.getAllTickets
        .filter((ticket: TicketData) => ticket.status === statusFilter));
  }, [serviceFilter, statusFilter, ticketsList]);

  return (
    <div>

      <div className="f-title-format">
        <h1 className="f-main-title">Tickets</h1>
        <div className="f-decoration-line" />
      </div>

      <div className="flex flex-row gap-12 justify-center mb-8">
        <select className="f-select" name="services" onChange={filterServices}>
          <option value="">Filtrer par service</option>
          {servicesList && servicesList!
        && servicesList.getAllServices.map((service: ServiceData) => (
          <option key={service.id} value={service.name}>{service.name}</option>
        ))}
        </select>
        <select className="f-select" name="status" onChange={filterStatus}>
          {StatusObjectEnum.map((stat) => (
            <option key={stat.key} value={stat.key}>{stat.name}</option>
          ))}
        </select>
        <select className="f-select" name="date" onChange={filterDate} defaultValue="today">
          {DateFilterObjectEnum.map((date) => (
            <option key={date.key} value={date.key}>{date.name}</option>
          ))}
        </select>
      </div>

      {ticketsListLoading && <p>Loading ...</p>}

      <TicketsList
        handleOpenModal={handleOpenModal}
        ticketsList={filteredTicketList && filteredTicketList}
      />

      {ticketToUpdate && (
      <TicketModal
        isModalOpen={isModalOpen}
        ticketToUpdate={ticketToUpdate}
        handleCloseModal={handleCloseModal}
        handleUpdateTicket={handleUpdateTicket}
      />
      )}

    </div>
  );
}

export default AdminTicketsPage;
