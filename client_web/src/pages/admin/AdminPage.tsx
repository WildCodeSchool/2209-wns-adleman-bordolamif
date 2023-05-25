import { NavLink, useLocation } from 'react-router-dom';
import AdminServicesState from '@components/adminComponents/AdminServicesState';
import AdminStatistics from '@components/adminComponents/AdminStatistics';

function AdminPage() {
  const location = useLocation();
  const activeStyle = {
    color: '#f97316',
  };
  return (
    <div>
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
            État des services
          </NavLink>
          <NavLink
            to="/admin/dashboard/statistics"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Statistiques
          </NavLink>
        </div>
        <div className="f-decoration-line-for-tab" />
      </div>
      {location.pathname === '/admin/dashboard' && (
      <AdminServicesState />
      )}
      {location.pathname === '/admin/dashboard/statistics' && (
      <AdminStatistics />

      )}
    </div>
  );
}
export default AdminPage;
