import CalledTicketByCounter from '@components/cards/CalledTicketByCounter';
import DashboardSuspendedTickets from '@components/cards/DashboardSuspendedTickets';
import DashboardWaitingTickets from '@components/cards/DashboardWaitingTickets';
import OperatorsInService from '@components/cards/OperatorsInService';
import WaitingTicketsByService from '@components/cards/WaitingTicketsByService';
import { StatusEnum } from '@utils/enum/StatusEnum';
import {
  Service, TicketData, UserData, WaitingRoomData,
} from '@utils/types/DataTypes';

interface Props{
  profile: UserData
  ticketsList: TicketData[]
  waitingRoom: WaitingRoomData
  callSuspendedTicket: (id: number)=>void
  callNextTicket: ()=>void
  connectedUsersList: UserData[]
}
function
OperatorWaitingRoom(props: Props) {
  const {
    profile, ticketsList, waitingRoom, callSuspendedTicket, callNextTicket, connectedUsersList,
  } = props;
  return (
    <div>
      <div>
        <CalledTicketByCounter
          ticketsList={ticketsList! && ticketsList
            .filter((ticket:TicketData) => ticket.counter !== null)}
        />
        {waitingRoom! && waitingRoom.services.filter(
          (service) => service.id !== profile.currentService?.id,
        ).map(
          (service: Service) => (
            <WaitingTicketsByService
              key={service.id}
              ticketsList={ticketsList! && ticketsList
                .filter((ticket:TicketData) => ticket.service.id === service.id
                && ticket.status !== StatusEnum.EN_TRAITEMENT)}
              service={service}
            />
          ),
        )}
      </div>
      <div>
        <p>Tickets restants : {ticketsList! && ticketsList
          .filter((ticket:TicketData) => ticket.service.id === profile.currentService?.id
          && ticket.status !== StatusEnum.EN_TRAITEMENT).length}
        </p>
        <div className="bg-gray-200 w-1/3 rounded-2xl">
          <DashboardWaitingTickets
            ticketsList={ticketsList! && ticketsList.filter(
              (ticket) => ticket.service.id === profile!.currentService!.id
              && (ticket.status !== StatusEnum.AJOURNE),
            )}
          />
        </div>
        <DashboardSuspendedTickets
          profile={profile!}
          callSuspendedTicket={callSuspendedTicket}
          ticketsList={ticketsList! && ticketsList.filter(
            (ticket) => (ticket.service.id === profile!.currentService!.id)
            && (ticket.status === StatusEnum.AJOURNE),
          )}
        />
        {profile.counter.ticket ? <button disabled type="button" className="bg-gray-400 text-white rounded p-1 m-1">Ticket en cours de traitement</button> : <button onClick={callNextTicket} type="button" className="m-3 bg-green-500 rounded p-3">Appeler le prochain ticket</button>}
        <OperatorsInService connectedUsersList={profile! && connectedUsersList!
               && connectedUsersList.filter((user) => user.id !== profile.id
               && user.currentService!.id === profile.currentService!.id)}
        />
      </div>
    </div>
  );
}
export default OperatorWaitingRoom;
