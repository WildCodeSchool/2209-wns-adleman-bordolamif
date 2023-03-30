import OperatorDashboard from '@components/operatorComponents/OperatorDashboard';
import { NavLink, useLocation } from 'react-router-dom';
import OperatorMyWaitingRoomPage from './OperatorMyWaitingRoomPage';

function OperatorBoard() {
  const location = useLocation();

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
      <OperatorDashboard />
      )}
      {location.pathname === '/operator/dashboard/mywaitingroom' && (
      <OperatorMyWaitingRoomPage />
      )}
    </>
  );
}
export default OperatorBoard;
