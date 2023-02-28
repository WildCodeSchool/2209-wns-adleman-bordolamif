import { ApolloClient, useMutation } from '@apollo/client';
import { LOGOUT } from '@graphQL/mutations/userMutations';
import { UserProfile } from '@utils/types/DataTypes';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ComputerDesktopIcon,
  TicketIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import DarkLogo from '@assets/DarkLogo';

interface Props {
  userProfile: UserProfile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

function Menu({ userProfile, client }:Props) {
  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();
  const onLogout = async () => {
    await logout();
    await client.resetStore();
    navigate('/auth');
  };

  const firstNameLetter = `${userProfile.firstname.charAt(0).toUpperCase()}.`;

  return (
    <div> {userProfile !== undefined && (
    <div className="pl-2 py-6 w-[15rem]">
      {userProfile.role === 1 ? (
        <div className="flex flex-col justify-between h-screen">
          <div>
            <div className="ml-6 scale-125">
              <NavLink to="/admin">
                <DarkLogo />
              </NavLink>
            </div>
            <h1 className="pb-8 nunito-bold text-xl mt-6">Admin {firstNameLetter} {userProfile.lastname} </h1>
            <ul className="flex flex-col pb-8 pl-4">
              <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
                <HomeIcon className="w-7 mr-4" />
                <NavLink to="/admin">Tableau de bord</NavLink>
              </div>
              <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
                <ComputerDesktopIcon className="w-7 mr-4" />
                <NavLink to="/admin/services">Services</NavLink>
              </div>
              <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
                <TicketIcon className="w-7 mr-4" />
                <NavLink to="/admin/waitingroomsandcounters">Guichets</NavLink>
              </div>
              <div className="flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer">
                <PresentationChartBarIcon className="w-7 mr-4" />
                <NavLink to="/admin/statistics">Statistiques</NavLink>
              </div>
              <div className="flex flex-raw text-outline text-orange-500 items-center hover:underline decoration-2 cursor-pointer">
                <UserGroupIcon className="w-7 mr-4" />
                <NavLink to="/admin/users">Gestion des opérateurs</NavLink>
              </div>
            </ul>
          </div>
          <div className="pl-4 flex flex-raw items-center pb-6 hover:underline decoration-2 cursor-pointer mb-10 mt-6">
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
      ) : (
        <div>
          <h1 className="pb-12 nunito-bold text-xl">Opérateur {userProfile.email}</h1>
          <ul className="flex flex-col pb-10 pl-4">
            <NavLink to="/operator">Mise en service</NavLink>
            <NavLink to="/operator/board">Tableau de bord</NavLink>
          </ul>
        </div>
      )}
    </div>
    )}
    </div>

  );
}
export default Menu;
