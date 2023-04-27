import TicketUpdateForm from '@components/forms/TicketUpdateForm';
import { TicketData } from '@utils/types/DataTypes';
import { TicketInput } from '@utils/types/InputTypes';

interface Props {
    ticketToUpdate: TicketData;
    isModalOpen : boolean;
    handleCloseModal: () => void;
    handleUpdateTicket: (data:TicketInput, id:number) => void
}

function TicketModal(props: Props) {
  const {
    ticketToUpdate, isModalOpen, handleCloseModal, handleUpdateTicket,
  } = props;
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
          <h2 className="f-client-subtitle">Edition de ticket</h2>
        </div>
        <TicketUpdateForm
          ticketToUpdate={ticketToUpdate}
          handleUpdateTicket={handleUpdateTicket}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default TicketModal;
