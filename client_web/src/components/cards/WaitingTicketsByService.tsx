import { Service, TicketData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface Props {
  ticketsList: TicketData[]
  service: Service
}

function WaitingTicketsByService(props:Props) {
  const { ticketsList, service } = props;
  return (
    <div className="bg-gray-300 m-1 p-1 rounded">
      <h3>{service.name}</h3>
      {ticketsList && ticketsList! && ticketsList.slice(0, 3).map(
        (ticket) => <TicketDetails key={ticket.id} ticket={ticket} />,
      )}
      {ticketsList && ticketsList! && ticketsList.length > 3
      && <p> + {ticketsList.length - 3} tickets</p>}
    </div>
  );
}

export default WaitingTicketsByService;
