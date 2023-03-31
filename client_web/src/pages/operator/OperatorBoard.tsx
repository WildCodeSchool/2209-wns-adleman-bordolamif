import { useQuery } from '@apollo/client';
import OperatorDashboard from '@components/operatorComponents/OperatorDashboard';
import { GET_ALL_TICKETS_FOR_WAITING_ROOM } from '@graphQL/query/ticketQuery';
import { useUserProfile } from '@layouts/StaffLayout';
import { NavLink, useLocation } from 'react-router-dom';
import OperatorMyWaitingRoomPage from './OperatorMyWaitingRoomPage';

function OperatorBoard() {
  const location = useLocation();
  const { userProfile } = useUserProfile();

  const { data: ticketsList } = useQuery(
    GET_ALL_TICKETS_FOR_WAITING_ROOM,
    {
      variables: {
        waitingRoomId: userProfile?.counter.waitingRoom.id,
        skip: userProfile,
      },
    },
  );

  const callNextTicket = () => {
    // console.log('toto');
  };

  // console.log(userProfile, ticketsList);

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
        profile={userProfile}
        ticketsList={ticketsList}
        callNextTicket={callNextTicket}
      />
      )}
      {location.pathname === '/operator/dashboard/mywaitingroom' && (
      <OperatorMyWaitingRoomPage profile={userProfile} />
      )}
    </>
  );
}
export default OperatorBoard;
