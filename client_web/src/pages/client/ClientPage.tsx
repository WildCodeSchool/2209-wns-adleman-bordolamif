import { useMutation, useQuery, useSubscription } from '@apollo/client';
import DarkLogo from '@assets/DarkLogo';
import TicketDetails from '@components/details/TicketDetails';
import ServicesList from '@components/lists/ServicesList';
import TicketCreationModal from '@components/modals/TicketCreationModal';
import { CREATE_TICKET } from '@graphQL/mutations/ticketMutations';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { GET_ALL_TICKETS } from '@graphQL/query/ticketQuery';
import { CREATED_TICKET, UPDATED_TICKET } from '@graphQL/subscriptions/ticketSubscriptions';
import useModal from '@utils/hooks/UseModal';
import { ServiceData, TicketData } from '@utils/types/DataTypes';
import { TicketInput } from '@utils/types/InputTypes';
import { useEffect, useState } from 'react';

function ClientPage() {
  const {
    loading: servicesListLoading,
    data: servicesList,
    refetch: refetchServicesList,
  } = useQuery(GET_ALL_SERVICES);

  const { data: ticketsList, refetch: refetchTickets, subscribeToMore: subscribeToMoreTickets } = useQuery(GET_ALL_TICKETS, { variables: { filter: 'today' } });

  const [CreateTicket] = useMutation(CREATE_TICKET);

  const { data: newTicket } = useSubscription(CREATED_TICKET);
  const { data: updatedTicket, loading: updateTicketLoading } = useSubscription(UPDATED_TICKET);

  const { isModalOpen, openModal, closeModal } = useModal();

  const [serviceTicketToCreate, setServiceTicketToCreate] = useState<ServiceData>();
  const [createdTicket, setCreatedTicket] = useState<TicketData | null>();

  const handleCreateTicket = async (ticket: TicketInput) => {
    const { data } = await CreateTicket({ variables: { data: ticket } });
    setCreatedTicket(data.createTicket);
    setTimeout(() => setCreatedTicket(null), 5000);
    await refetchServicesList();
    await refetchTickets();
  };

  const handleOpenModal = (service: ServiceData) => {
    setServiceTicketToCreate(service);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    subscribeToMoreTickets({
      document: CREATED_TICKET,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const ticketToAdd = subscriptionData.data.newTicket;
        const isTicketAlreadyAdded = prev.getAllTickets
          .some((ticket: TicketData) => ticket.id === ticketToAdd.id);
        if (isTicketAlreadyAdded) return prev;
        return {
          ...prev,
          getAllTickets: [...prev.getAllTickets, ticketToAdd],
        };
      },
    });
  }, [newTicket, subscribeToMoreTickets, ticketsList]);

  useEffect(() => {
    if (!updateTicketLoading && updatedTicket!) {
      subscribeToMoreTickets({
        document: UPDATED_TICKET,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const ticketToUpdate = subscriptionData.data.updatedTicket;

          const newList = prev.getAllTickets.map(
            (ticket: TicketData) => (ticket.id === ticketToUpdate.id ? ticketToUpdate : ticket),
          );
          return {
            ...prev,
            getAllTickets: newList,
          };
        },
      });
    }
  }, [updatedTicket, subscribeToMoreTickets, updateTicketLoading]);

  return (
    <div>
      <h2 className="text-center mt-8 text-4xl nunito-bold">Bienvenue dans votre espace de santé</h2>
      <p className="text-center mt-6 mb-2 text-3xl">Merci de bien vouloir cliquer sur le <span className="nunito-bold">service de votre choix</span></p>
      {servicesListLoading && <p>Chargement ...</p>}

      <div className="overflow-y-auto max-h-[38rem] pb-4">
        <ServicesList
          ticketsList={ticketsList && ticketsList.getAllTickets}
          servicesList={servicesList && servicesList.getAllServices}
          mode="cards"
          handleOpenModal={handleOpenModal}
        />
      </div>
      {serviceTicketToCreate && (
        <TicketCreationModal
          serviceTicketToCreate={serviceTicketToCreate}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          handleCreateTicket={handleCreateTicket}
        />
      )}
      {createdTicket && (
        <div className="absolute flex flex-col left-0 top-0 h-screen w-screen bg-white items-center justify-center">
          <p className="nunito-bold mb-8 text-2xl text-center">Votre ticket est le numéro : </p>
          <TicketDetails ticket={createdTicket} />
          <p className="mt-8 text-2xl text-center">Rendez-vous en salle d'attente :
            <span className="ml-2 nunito-bold">{serviceTicketToCreate?.waitingRoom?.name}</span>
          </p>
          <p className="nunito-bold text-4xl text-center mt-8 mb-32">Merci de récupérer votre ticket papier</p>
          <button
            className="underline"
            type="button"
            onClick={() => setCreatedTicket(null)}
          >
            Retour à la page d'accueil
          </button>
          <div className="f-client-format-logo">
            <DarkLogo />
          </div>
        </div>
      )}
    </div>
  );
}
export default ClientPage;
