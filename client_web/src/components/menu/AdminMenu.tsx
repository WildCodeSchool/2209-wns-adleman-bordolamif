import {
  HomeIcon,
  ComputerDesktopIcon,
  TicketIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import DarkLogo from '@assets/DarkLogo';
import { NavLink, useNavigate } from 'react-router-dom';
import { ApolloClient, useMutation } from '@apollo/client';
import { UserProfile } from '@utils/types/DataTypes';
import { LOGOUT } from '@graphQL/mutations/userMutations';

interface Props {
    userProfile: UserProfile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>
  }

function AdminMenu({ userProfile, client }:Props) {
  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();
  const onLogout = async () => {
    await logout();
    await client.resetStore();
    navigate('/auth');
  };

  const activeStyle = {
    color: '#f97316',
  };

  const firstNameLetter = `${userProfile.firstname.charAt(0).toUpperCase()}.`;

  return (
    <div className="flex flex-col justify-between h-screen fixed">
      <div>
        <div className="ml-6 scale-125">
          <NavLink
            to="/admin/dashboard"
          >
            <DarkLogo />
          </NavLink>
        </div>
        <h1 className="pb-8 nunito-bold text-xl mt-6">Admin {firstNameLetter} {userProfile.lastname} </h1>
        <ul className="flex flex-col pb-8 pl-4">
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <HomeIcon className="w-7 mr-4" />
              Tableau de bord
            </div>
          </NavLink>
          <NavLink
            to="/admin/services"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <ComputerDesktopIcon className="w-7 mr-4" />
              Services
            </div>
          </NavLink>
          <NavLink
            to="/admin/waitingroomsandcounters"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <ClipboardDocumentCheckIcon className="w-7 mr-4" />
              Guichets
            </div>
          </NavLink>
          <NavLink
            to="/admin/tickets"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <TicketIcon className="w-7 mr-4" />
              Tickets
            </div>
          </NavLink>
          <NavLink
            to="/admin/statistics"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
              <PresentationChartBarIcon className="w-7 mr-4" />
              Statistiques
            </div>
          </NavLink>
          <NavLink
            to="/admin/users"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <div className="flex flex-raw text-outline items-center hover:underline decoration-2 cursor-pointer">
              <UserGroupIcon className="w-7 mr-4" />
              Gestion des opérateurs
            </div>
          </NavLink>
        </ul>
      </div>
      <div className="pl-4 flex flex-raw items-center text-red-600 pb-6 hover:underline decoration-2 cursor-pointer mb-10 pt-6">
        <ArrowLeftOnRectangleIcon className="w-7 mr-4" />
        <button
          type="button"
          onClick={onLogout}
          className=""
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default AdminMenu;
