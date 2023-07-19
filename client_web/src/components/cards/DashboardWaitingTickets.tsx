import { TicketData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface Props {
  ticketsList: TicketData[]
}

function DashboardWaitingTickets(props:Props) {
  const { ticketsList } = props;
  return (
    <div className="p-2">
      <h2 className="f-dashboard-titles">Tickets en attentes</h2>
      {ticketsList! && ticketsList.slice(0, 3).map(
        (ticket) => <TicketDetails key={ticket.id} ticket={ticket} />,
      )}
      {ticketsList! && ticketsList.length > 3
      && <p className="text-3xl my-4 text-center"> + {ticketsList.length - 3} tickets</p>}
    </div>

  );
}

export default DashboardWaitingTickets;
