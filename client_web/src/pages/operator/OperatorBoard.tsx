import { useMutation, useQuery } from '@apollo/client';
import OperatorDashboard from '@components/operatorComponents/OperatorDashboard';
import { PARTIAL_COUNTER_UPDATE } from '@graphQL/mutations/counterMutations';
import { PARTIAL_TICKET_UPDATE } from '@graphQL/mutations/ticketMutations';
import { GET_ALL_TICKETS_FOR_WAITING_ROOM } from '@graphQL/query/ticketQuery';
import { GET_ALL_USERS } from '@graphQL/query/userQuery';
import { GET_ONE_WAITINGROOM } from '@graphQL/query/waitingRoomQuery';
import { useUserProfile } from '@layouts/StaffLayout';
import { StatusEnum } from '@utils/enum/StatusEnum';
import { TicketData } from '@utils/types/DataTypes';
import { NavLink, useLocation } from 'react-router-dom';
import OperatorMyWaitingRoomPage from './OperatorMyWaitingRoomPage';

function OperatorBoard() {
  const location = useLocation();
  const { userProfile } = useUserProfile();

  const { data: ticketsList, refetch } = useQuery(
    GET_ALL_TICKETS_FOR_WAITING_ROOM,
    {
      variables: {
        waitingRoomId: userProfile?.counter.waitingRoom.id,
        skip: userProfile,
      },
    },
  );

  const { data: waitingRoom } = useQuery(
    GET_ONE_WAITINGROOM,
    {
      variables: {
        getOneWaitingRoomId: userProfile?.counter.waitingRoom.id,
        skip: userProfile,
      },
    },
  );

  const { data: connectedUsersList } = useQuery(GET_ALL_USERS, { variables: { connected: true } });

  const [PartialTicketUpdate] = useMutation(PARTIAL_TICKET_UPDATE);
  const [PartialCounterUpdate] = useMutation(PARTIAL_COUNTER_UPDATE);

  const callNextTicket = async () => {
    const nextTicket = ticketsList.getAllTicketsForWaitingRoom.filter(
      (ticket: TicketData) => ticket.service.id === userProfile!.currentService!.id,
    )[0];
    await PartialTicketUpdate({
      variables: {
        data: { status: StatusEnum.EN_TRAITEMENT },
        partialTicketUpdateId: nextTicket.id,
      },
    });
    await PartialCounterUpdate({
      variables: {
        data: { ticket: { id: nextTicket.id } }, partialCounterUpdateId: userProfile?.counter.id,
      },
    });
  };

  const changeCurrentTicketStatus = async (status: StatusEnum) => {
    try {
      await PartialTicketUpdate({
        variables: {
          data: { status },
          partialTicketUpdateId: userProfile?.counter.ticket.id,
        },
      });
      await PartialCounterUpdate({
        variables: {
          data: { ticket: { id: 0 } }, partialCounterUpdateId: userProfile?.counter.id,
        },
      });
      await refetch();
    } catch (e) {
      throw new Error('Error while updating ticket');
    }
  };

  // console.log(userProfile, ticketsList, connectedUsersList);

  const activeStyle = {
    color: '#f97316',
  };
  return (
    <>
      <div>
        <div className="flex flex-col items-center mb-4">
          <h1 className="f-main-title">Tableau de bord</h1>
        </div>
        <div className="flex flex-row justify-around text-2xl">
          <NavLink
            to="/operator/dashboard"
            end
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Mon service
          </NavLink>
          <NavLink
            to="/operator/dashboard/mywaitingroom"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Ma salle d'attente
          </NavLink>
        </div>
        <div className="f-decoration-line-for-tab" />
      </div>
      {location.pathname === '/operator/dashboard' && (
      <OperatorDashboard
        changeCurrentTicketStatus={changeCurrentTicketStatus}
        profile={userProfile}
        ticketsList={ticketsList! && ticketsList.getAllTicketsForWaitingRoom}
        callNextTicket={callNextTicket}
        waitingRoom={waitingRoom! && waitingRoom.getOneWaitingRoom}
        connectedUsersList={connectedUsersList!
          && connectedUsersList.getAllUsers}
      />
      )}
      {location.pathname === '/operator/dashboard/mywaitingroom' && (
      <OperatorMyWaitingRoomPage profile={userProfile} />
      )}
    </>
  );
}
export default OperatorBoard;
