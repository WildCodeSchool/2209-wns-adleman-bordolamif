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
          ? 'f-modal-background'
          : 'hidden'
      }
    >
      <div className="f-modal-window">
        <div className="f-modal-format">
          {!ticketToCreate
          && (
          <div className="flex flex-col">
            <h2 className="f-client-subtitle">Confirmez-vous votre choix ?</h2>
            <div className="flex flex-row items-center justify-center gap-4">
              <ServiceIcon service={serviceTicketToCreate} />
              <p className="text-4xl nunito-bold">{serviceTicketToCreate.name}</p>
            </div>
            <div className="f-client-button-format">
              <button
                className="f-button-red-client"
                type="button"
                onClick={handleCloseModal}
              >
                NON
              </button>
              <button
                className="f-button-green-client"
                type="button"
                onClick={handleConfirmService}
              >
                OUI
              </button>
            </div>
          </div>
          )}
          {ticketToCreate && (
          <div>
            <h2 className="f-client-subtitle">Est-ce votre premier rendez-vous ?</h2>
            <div className="f-client-button-format">
              <button
                className="f-button-red-client"
                type="button"
                onClick={() => handleIsFirstTime(false)}
              >
                NON
              </button>
              <button
                className="f-button-green-client"
                type="button"
                onClick={() => handleIsFirstTime(true)}
              >
                OUI
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketCreationModal;
