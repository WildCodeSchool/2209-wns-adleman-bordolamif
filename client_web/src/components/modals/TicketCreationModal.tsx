import ServiceIcon from '@components/icons/ServiceIcon';
import { ServiceData } from '@utils/types/DataTypes';
import { TicketInput } from '@utils/types/InputTypes';
import { useState } from 'react';

interface Props {
    serviceTicketToCreate: ServiceData;
    isModalOpen : boolean;
    handleCloseModal: () => void;
    handleCreateTicket: (data:TicketInput) => void
}

function TicketCreationModal(props: Props) {
  const {
    serviceTicketToCreate, isModalOpen, handleCloseModal, handleCreateTicket,
  } = props;

  const [ticketToCreate, setTicketToCreate] = useState<TicketInput|null>();

  const handleConfirmService = () => {
    setTicketToCreate({
      isFirstTime: false,
      service: { id: serviceTicketToCreate.id },
    });
  };

  const handleIsFirstTime = async (isFirstTime:boolean) => {
    const ticketToSend = {
      isFirstTime,
      service: { id: serviceTicketToCreate.id },
    };
    await handleCreateTicket(ticketToSend);
    setTicketToCreate(null);
    handleCloseModal();
  };

  return (
    <div
      className={
        isModalOpen
          ? 'absolute inset-0 filter backdrop-blur-sm m-auto z-10 flex flex-col items-center justify-center'
          : 'hidden'
      }
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <div className="mb-7 text-gray-700 flex justify-between">
          {!ticketToCreate
          && (
          <div className="flex flex-col">
            <h2>Merci de confirmer votre choix</h2>
            <ServiceIcon service={serviceTicketToCreate} />
            <p>{serviceTicketToCreate.name}</p>
            <button type="button" onClick={handleConfirmService}>OUI</button>
            <button type="button" onClick={handleCloseModal}>NON</button>
          </div>
          )}
          {ticketToCreate && (
          <div>
            <h2>Est-ce votre premier rendez-vous ?</h2>
            <button type="button" onClick={() => handleIsFirstTime(true)}>OUI</button>
            <button type="button" onClick={() => handleIsFirstTime(false)}>NON</button>
          </div>
          )}
          <button type="button" className="font-bold" onClick={() => handleCloseModal()}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketCreationModal;
