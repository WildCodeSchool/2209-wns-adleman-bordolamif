import { TicketData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface Props {
  ticketsList: TicketData[]
}

function DashboardWaitingTickets(props:Props) {
  const { ticketsList } = props;
  return (
    <>
      <h2 className="f-dashboard-titles">Tickets en attentes</h2>
      {ticketsList! && ticketsList.slice(0, 3).map(
        (ticket) => <TicketDetails key={ticket.id} ticket={ticket} />,
      )}
      {ticketsList! && ticketsList.length > 3
      && <p className="text-3xl mt-6 text-center"> + {ticketsList.length - 3} tickets</p>}
    </>

  );
}

export default DashboardWaitingTickets;
