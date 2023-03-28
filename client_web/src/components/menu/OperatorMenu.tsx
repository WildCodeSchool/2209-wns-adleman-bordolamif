import { NavLink } from 'react-router-dom';
import { ComputerDesktopIcon, HomeIcon } from '@heroicons/react/24/outline';

function OperatorMenu() {
  const activeStyle = {
    color: '#f97316',
  };
  return (
    <div className="flex flex-col">
      <div>
        <ul className="flex flex-col pb-8 pl-4">
          <NavLink
            to="/operator/services"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div
              className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer"
            >
              <HomeIcon className="w-7 mr-4" />
              Services disponibles
            </div>
          </NavLink>
          <NavLink
            to="/operator/dashboard"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div
              className="flex flex-row items-center pb-6 hover:underline decoration-2 cursor-pointer"
            >
              <ComputerDesktopIcon className="w-7 mr-4" />
              Tableau de bord
            </div>
          </NavLink>
          <NavLink
            to="/operator/myaccount"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div
              className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer"
            >
              <ComputerDesktopIcon className="w-7 mr-4" />
              Mon compte
            </div>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default OperatorMenu;
