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
          ? 'absolute inset-0 filter backdrop-blur-sm m-auto z-10 flex flex-col items-center justify-center'
          : 'hidden'
      }
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <div className="mb-7 text-gray-700 flex justify-between">
          <h2>Edition de ticket</h2>
          <button type="button" className="font-bold" onClick={() => handleCloseModal()}>
            X
          </button>
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
