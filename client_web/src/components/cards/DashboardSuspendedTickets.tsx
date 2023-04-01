import { TicketData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface Props {
  ticketsList: TicketData[]
}

function DashboardSuspendedTickets(props:Props) {
  const { ticketsList } = props;
  return (
    <div className="bg-gray-200 w-1/3 rounded-2xl">
      <h2 className="f-dashboard-titles">Tickets suspendus</h2>
      {ticketsList! && ticketsList.slice(0, 4).map(
        (ticket) => <TicketDetails key={ticket.id} ticket={ticket} />,
      )}
      {ticketsList! && ticketsList.length > 3
      && <p className="text-3xl mt-6 text-center"> + {ticketsList.length - 3} tickets</p>}
    </div>

  );
}

export default DashboardSuspendedTickets;
