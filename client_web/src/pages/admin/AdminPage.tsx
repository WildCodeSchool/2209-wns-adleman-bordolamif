import { NavLink, useLocation } from 'react-router-dom';
import ManWithComputer from '../../assets/illustrations/ManWithComputer.png';

function AdminPage() {
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
            to="/admin/dashboard"
            end
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Mon service
          </NavLink>
          <NavLink
            to="/admin/dashboard/mywaitingroom"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Ma salle d'attente
          </NavLink>
        </div>
        <div className="f-decoration-line-for-tab" />
      </div>
      {location.pathname === '/admin/dashboard' && (
      <div className="flex flex-col space-y-4 mt-4">
        <div className="bg-gray-200 rounded-2xl">
          <h2 className="f-dashboard-titles">Mon ticket en cours</h2>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="bg-gradient-to-b from-orange-500 to-red-500 w-1/3 rounded-2xl">
            <h2 className="f-dashboard-titles text-white">Tickets en attentes</h2>
          </div>
          <div className="bg-gray-200 w-1/3 rounded-2xl">
            <h2 className="f-dashboard-titles">Tickets suspendus</h2>
          </div>
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl">
              <h2 className="f-dashboard-titles text-center">Opérateurs sur le service</h2>
            </div>
            <img className="w-[350px]" src={ManWithComputer} alt="WomanWithComputer" />
          </div>
        </div>
        <div className="bg-gray-200 rounded-2xl">
          <h2 className="f-dashboard-titles">Vue d'ensemble</h2>
        </div>
      </div>
      )}
      {location.pathname === '/admin/dashboard/mywaitingroom' && (
      <h2 className="f-dashboard-titles">Ma salle d'attente</h2>
      )}
    </>
  );
}
export default AdminPage;
