import TicketDetails from '@components/details/TicketDetails';
import { TicketData } from '@utils/types/DataTypes';

interface Props {
  ticketsList:TicketData[]
}

function CalledTicketByCounter(props:Props) {
  const { ticketsList } = props;
  return (
    <div className="bg-gray-800">
      <h2 className="text-white">Tickets appelés</h2>
      <p className="text-white">Merci de vous rendre au guichet annoncé</p>
      {ticketsList && ticketsList! && ticketsList.map(
        (ticket) => (
          <div
            key={ticket.id}
            className="border border-white rounded m-2"
            style={{ backgroundColor: `${ticket.service.color}` }}
          >
            <TicketDetails ticket={ticket} />
            <p className="bg-white text-black mx-2 rounded px-1">{ticket.counter.name}</p>
          </div>
        ),
      )}
    </div>
  );
}

export default CalledTicketByCounter;
