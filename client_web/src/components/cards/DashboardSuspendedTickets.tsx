import { TicketData, UserData } from '@utils/types/DataTypes';
import TicketDetails from '@components/details/TicketDetails';

interface Props {
  ticketsList: TicketData[]
  profile: UserData
  callSuspendedTicket: (id:number) => void
}

function DashboardSuspendedTickets(props:Props) {
  const { ticketsList, callSuspendedTicket, profile } = props;
  return (
    <div className="bg-gray-200 w-1/3 rounded-2xl">
      <h2 className="f-dashboard-titles">Tickets suspendus</h2>
      {ticketsList! && ticketsList.slice(0, 4).map(
        (ticket) => <button disabled={profile.counter.ticket !== null} key={ticket.id} type="button" aria-label="Appeler le ticket suspendu" onClick={() => callSuspendedTicket(ticket.id)}><TicketDetails ticket={ticket} /></button>,
      )}
      {ticketsList! && ticketsList.length > 3
      && <p className="text-3xl mt-6 text-center"> + {ticketsList.length - 3} tickets</p>}
    </div>

  );
}

export default DashboardSuspendedTickets;
