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
            <div className="f-format-menu">
              <HomeIcon className="w-7 mr-4" />
              Tableau de bord
            </div>
          </NavLink>
          <NavLink
            to="/admin/services"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="f-format-menu">
              <ComputerDesktopIcon className="w-7 mr-4" />
              Services
            </div>
          </NavLink>
          <NavLink
            to="/admin/waitingroomsandcounters"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="f-format-menu">
              <ClipboardDocumentCheckIcon className="w-7 mr-4" />
              Salles d'attente
            </div>
          </NavLink>
          <NavLink
            to="/admin/tickets"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="f-format-menu">
              <TicketIcon className="w-7 mr-4" />
              Tickets
            </div>
          </NavLink>

          <NavLink
            to="/admin/users"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="f-format-menu">
              <UserGroupIcon className="w-7 mr-4" />
              Gestion des opérateurs
            </div>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default AdminMenu;
