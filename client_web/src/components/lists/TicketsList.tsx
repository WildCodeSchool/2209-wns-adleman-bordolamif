import TicketDetails from '@components/details/TicketDetails';
import { TicketData } from '@utils/types/DataTypes';

interface Props {
    ticketsList: TicketData[],

}

function TicketsList(props:Props) {
  const {
    ticketsList,
  } = props;

  return (
    <div className="flex flex-wrap">
      {ticketsList && ticketsList! && ticketsList.map((ticket) => (
        <TicketDetails
          key={ticket.id}
          ticket={ticket}
        />
      ))}
    </div>
  );
}

export default TicketsList;
