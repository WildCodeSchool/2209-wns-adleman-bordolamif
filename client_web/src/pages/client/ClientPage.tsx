import { useMutation, useQuery } from '@apollo/client';
import TicketDetails from '@components/details/TicketDetails';
import ServicesList from '@components/lists/ServicesList';
import TicketCreationModal from '@components/modals/TicketCreationModal';
import { CREATE_TICKET } from '@graphQL/mutations/ticketMutations';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import useModal from '@utils/hooks/UseModal';
import { ServiceData, TicketData } from '@utils/types/DataTypes';
import { TicketInput } from '@utils/types/InputTypes';
import { useState } from 'react';

function ClientPage() {
  const {
    loading: servicesListLoading,
    data: servicesList,
    refetch: refetchServicesList,
  } = useQuery(GET_ALL_SERVICES);

  const [CreateTicket] = useMutation(CREATE_TICKET);

  const { isModalOpen, openModal, closeModal } = useModal();

  const [serviceTicketToCreate, setServiceTicketToCreate] = useState<ServiceData>();
  const [createdTicket, setCreatedTicket] = useState<TicketData | null>();

  const handleCreateTicket = async (ticket: TicketInput) => {
    const { data } = await CreateTicket({ variables: { data: ticket } });
    setCreatedTicket(data.createTicket);
    setTimeout(() => setCreatedTicket(null), 15000);
    refetchServicesList();
  };

  const handleOpenModal = (service: ServiceData) => {
    setServiceTicketToCreate(service);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <div>
      <h1>Merci de bien vouloir cliquer sur le service de votre choix</h1>
      {servicesListLoading && <p>Chargement ...</p>}

      <ServicesList
        servicesList={servicesList && servicesList.getAllServices}
        mode="cards"
        handleOpenModal={handleOpenModal}

      />

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
          <p>Votre ticket est le numéro : </p>
          <TicketDetails ticket={createdTicket} />
          <p>Rendez-vous en salle d'attente : {serviceTicketToCreate?.waitingRoom?.name}</p>
          <button type="button" onClick={() => setCreatedTicket(null)}>Retour à la page d'accueil</button>
        </div>
      )}
    </div>

  );
}
export default ClientPage;
