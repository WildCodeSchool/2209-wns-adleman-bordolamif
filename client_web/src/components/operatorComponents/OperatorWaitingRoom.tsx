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
  connectedUsersList: UserData[]
}

function OperatorWaitingRoom(props: Props) {
  const {
    profile, ticketsList, waitingRoom, callSuspendedTicket, connectedUsersList,
  } = props;
  return (
    <div>
      <div>
        <CalledTicketByCounter
          ticketsList={ticketsList! && ticketsList
            .filter((ticket:TicketData) => ticket.counter !== null)}
        />
        <p className="text-3xl -mt-16">
          Tickets restants : {ticketsList! && ticketsList
          .filter((ticket:TicketData) => ticket.service.id === profile.currentService?.id
                && ticket.status !== StatusEnum.EN_TRAITEMENT).length}
        </p>
        <div className="flex flex-row justify-center gap-4 mt-4 mb-8">
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
      </div>
      <div>
        <div className="flex flex-row justify-center gap-20">
          <div className="bg-gray-200 w-1/3 rounded-2xl">
            <DashboardWaitingTickets
              ticketsList={ticketsList! && ticketsList.filter(
                (ticket) => ticket.service.id === profile!.currentService!.id
              && (ticket.status === StatusEnum.EN_ATTENTE),
              )}
            />
          </div>
          <div className="bg-gray-200 w-1/3 rounded-2xl">
            <DashboardSuspendedTickets
              profile={profile!}
              callSuspendedTicket={callSuspendedTicket}
              ticketsList={ticketsList! && ticketsList.filter(
                (ticket) => (ticket.service.id === profile!.currentService!.id)
            && (ticket.status === StatusEnum.AJOURNE),
              )}
            />
          </div>
        </div>
        <OperatorsInService
          connectedUsersList={profile! && connectedUsersList!
               && connectedUsersList.filter((user) => user.id !== profile.id
               && user.currentService!.id === profile.currentService!.id)}
        />
      </div>
    </div>
  );
}
export default OperatorWaitingRoom;
