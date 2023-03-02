import { ApolloClient, useMutation } from '@apollo/client';
import DarkLogo from '@assets/DarkLogo';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@utils/types/DataTypes';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminMenu from './menu/AdminMenu';
import OperatorMenu from './menu/OperatorMenu';
import { LOGOUT } from '@graphQL/mutations/userMutations';

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
    <div className="fixed flex flex-col justify-between h-screen">
      {userProfile !== undefined && (
      <div className="pl-2 py-6 w-[15rem]">
        {userProfile.role === 1 ? (
          <div>
            <div className="ml-6 scale-125">
              <NavLink
                to="/admin/dashboard"
              >
                <DarkLogo />
              </NavLink>
            </div>
            <h2 className="pb-8 nunito-bold text-xl mt-6">Admin {firstNameLetter} {userProfile.lastname} </h2>
            <AdminMenu />
          </div>
        ) : (
          <div>
            <div className="ml-6 scale-125">
              <NavLink
                to="/operator"
              >
                <DarkLogo />
              </NavLink>
            </div>
            <h2 className="pb-8 nunito-bold text-xl mt-6">Opé. {firstNameLetter} {userProfile.lastname} </h2>
            <OperatorMenu />
          </div>
        )}
      </div>
      )}
      <div className="pl-4 flex flex-raw items-center text-red-600 pb-6 hover:underline decoration-2 cursor-pointer mb-6 pt-6">
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
export default Menu;
