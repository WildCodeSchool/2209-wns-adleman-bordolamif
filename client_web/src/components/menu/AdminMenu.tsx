import {
  HomeIcon,
  ComputerDesktopIcon,
  TicketIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

function AdminMenu() {
  const activeStyle = {
    color: '#f97316',
  };

  return (
    <div className="flex flex-col">
      <div>
        <ul className="flex flex-col pb-8 pl-4">
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <HomeIcon className="w-7 mr-4" />
              Tableau de bord
            </div>
          </NavLink>
          <NavLink
            to="/admin/services"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <ComputerDesktopIcon className="w-7 mr-4" />
              Services
            </div>
          </NavLink>
          <NavLink
            to="/admin/waitingroomsandcounters"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <ClipboardDocumentCheckIcon className="w-7 mr-4" />
              Salles d'attente
            </div>
          </NavLink>
          <NavLink
            to="/admin/tickets"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <TicketIcon className="w-7 mr-4" />
              Tickets
            </div>
          </NavLink>
          <NavLink
            to="/admin/statistics"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <PresentationChartBarIcon className="w-7 mr-4" />
              Statistiques
            </div>
          </NavLink>
          <NavLink
            to="/admin/users"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row text-outline pb-6 items-center hover:underline decoration-2 cursor-pointer">
              <UserGroupIcon className="w-7 mr-4" />
              Gestion des opérateurs
            </div>
          </NavLink>
          <NavLink
            to="/admin/myaccount"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-row text-outline pb-6 items-center hover:underline decoration-2 cursor-pointer">
              <UserGroupIcon className="w-7 mr-4" />
              Mon compte
            </div>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default AdminMenu;
