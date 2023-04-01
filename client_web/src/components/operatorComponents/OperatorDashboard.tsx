import DashboardOverview from '@components/cards/DashboardOverview';
import DashboardSuspendedTickets from '@components/cards/DashboardSuspendedTickets';
import DashboardWaitingTickets from '@components/cards/DashboardWaitingTickets';
import OngoingUserTicket from '@components/cards/OngoingUserTicket';
import OperatorsInService from '@components/cards/OperatorsInService';
import { StatusEnum } from '@utils/enum/StatusEnum';
import {
  TicketData, UserData, WaitingRoomData,
} from '@utils/types/DataTypes';
import ManWithComputer from '../../assets/illustrations/ManWithComputer.png';

interface Props{
  profile: UserData | null
  ticketsList: TicketData[]
  waitingRoom: WaitingRoomData
  connectedUsersList: UserData[]
  callNextTicket: ()=> void
  callSuspendedTicket: (id: number) => void
  changeCurrentTicketStatus: (stauts: StatusEnum)=>void
  isModalOpen: boolean
  handleCloseModal: ()=>void
  treatedTicket:string

}

function OperatorDashboard(props:Props) {
  const {
    profile, ticketsList, connectedUsersList,
    waitingRoom, callNextTicket, changeCurrentTicketStatus,
    isModalOpen, handleCloseModal, treatedTicket, callSuspendedTicket,
  } = props;

  return (
    <div>
      <div className="flex flex-col space-y-4 mt-4">
        <OngoingUserTicket
          profile={profile}
          changeCurrentTicketStatus={changeCurrentTicketStatus}
          callNextTicket={callNextTicket}
        />
        <div className="flex flex-row space-x-4">
          <DashboardWaitingTickets
            ticketsList={ticketsList! && ticketsList.filter(
              (ticket) => ticket.service.id === profile!.currentService!.id
              && (ticket.status !== StatusEnum.AJOURNE),
            )}
          />
          <DashboardSuspendedTickets
            profile={profile!}
            callSuspendedTicket={callSuspendedTicket}
            ticketsList={ticketsList! && ticketsList.filter(
              (ticket) => (ticket.service.id === profile!.currentService!.id)
            && (ticket.status === StatusEnum.AJOURNE),
            )}
          />
          <div className="flex flex-col justify-between">
            <OperatorsInService connectedUsersList={profile! && connectedUsersList!
               && connectedUsersList.filter((user) => user.id !== profile.id
               && user.currentService!.id === profile.currentService!.id)}
            />
            <img className="w-[350px]" src={ManWithComputer} alt="WomanWithComputer" />
          </div>
        </div>
        <DashboardOverview
          connectedUsersList={connectedUsersList}
          profile={profile}
          waitingRoom={waitingRoom}
          ticketsList={ticketsList}
        />
      </div>
      <div
        className={
        isModalOpen
          ? 'fixed bottom-0 right-0 flex'
          : 'hidden'
      }
      >
        <div className="bg-white shadow-md rounded m-4 w-full max-w-sm flex p-4">
          <p className="text-green-500 mr-2">Ticket {treatedTicket} traité !</p>
          <button type="button" onClick={() => handleCloseModal()}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}
export default OperatorDashboard;
