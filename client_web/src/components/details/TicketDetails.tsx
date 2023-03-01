import { TicketData } from '@utils/types/DataTypes';

interface Props {
    ticket: TicketData,
    handleOpenModal: (user:TicketData) => void

}

function TicketDetails(props: Props) {
  const { ticket, handleOpenModal } = props;

  return (
    <button
      type="button"
      onClick={() => handleOpenModal(ticket)}
      className="w-20 rounded m-1 p-1"
      style={{ backgroundColor: `${ticket.service.color}` }}
    >
      <p>{ticket.name}</p>
    </button>
  );
}
export default TicketDetails;
