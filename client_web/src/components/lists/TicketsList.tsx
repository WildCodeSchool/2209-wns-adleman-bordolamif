import TicketDetails from '@components/details/TicketDetails';
import { TicketData } from '@utils/types/DataTypes';

interface Props {
    ticketsList: TicketData[],
    handleOpenModal: (ticket:TicketData) => void
}

function TicketsList(props:Props) {
  const {
    ticketsList, handleOpenModal,
  } = props;

  return (
    <div className="flex flex-wrap">
      {ticketsList && ticketsList! && ticketsList.map((ticket) => (
        <TicketDetails
          handleOpenModal={handleOpenModal}
          key={ticket.id}
          ticket={ticket}
        />
      ))}
    </div>
  );
}

export default TicketsList;
