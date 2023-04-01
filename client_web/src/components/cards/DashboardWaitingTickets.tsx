import { TicketData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface Props {
  ticketsList: TicketData[]
}

function DashboardWaitingTickets(props:Props) {
  const { ticketsList } = props;
  return (
    <div className="bg-gradient-to-b from-orange-500 to-red-500 w-1/3 rounded-2xl">
      <h2 className="f-dashboard-titles text-white">Tickets en attentes</h2>
      {ticketsList! && ticketsList.slice(0, 4).map(
        (ticket) => <TicketDetails key={ticket.id} ticket={ticket} />,
      )}
      {ticketsList! && ticketsList.length > 3
      && <p className="text-3xl mt-6 text-center"> + {ticketsList.length - 3} tickets</p>}
    </div>

  );
}

export default DashboardWaitingTickets;
