import { useQuery } from '@apollo/client';
import TicketsList from '@components/lists/TicketsList';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { GET_ALL_TICKETS } from '@graphQL/query/ticketQuery';
import { ServiceData, TicketData } from '@utils/types/DataTypes';
import { useEffect, useState } from 'react';

const status = [{ name: 'En attente', key: 1 }, { name: 'Ajourné', key: 2 }, { name: 'En traitement', key: 3 }, { name: 'Traité', key: 4 }];

function AdminTicketsPage() {
  const [statusFilter, setStatusFilter] = useState<number>(1);
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [filteredTicketList, setFilteredTicketList] = useState<TicketData[]>([]);

  const {
    loading: ticketsListLoading,
    data: ticketsList,
  } = useQuery(GET_ALL_TICKETS);

  const {
    data: servicesList,
  } = useQuery(GET_ALL_SERVICES);

  const filterStatus = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(parseInt(e.target.value, 10));
  };

  const filterServices = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setServiceFilter(e.target.value);
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
      <select name="services" onChange={filterServices}>
        <option value="">Filtrer par service</option>
        {servicesList && servicesList!
        && servicesList.getAllServices.map((service: ServiceData) => (
          <option key={service.id} value={service.name}>{service.name}</option>
        ))}
      </select>

      <select name="status" onChange={filterStatus}>
        {status.map((stat) => (
          <option key={stat.key} value={stat.key}>{stat.name}</option>
        ))}
      </select>

      <h1>TicketPage</h1>
      {ticketsListLoading && <p>Loading ...</p>}

      <TicketsList ticketsList={filteredTicketList && filteredTicketList} />

    </div>
  );
}

export default AdminTicketsPage;
