import { ApolloClient, useMutation } from '@apollo/client';
import DarkLogo from '@assets/DarkLogo';
import { ArrowLeftOnRectangleIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@utils/types/DataTypes';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import OperatorMenu from './OperatorMenu';
import { LOGOUT } from '@graphQL/mutations/userMutations';
import { RoleEnum } from '@utils/enum/RoleEnum';

interface Props {
  userProfile: UserProfile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

function Menu({ userProfile, client }: Props) {
  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await logout({ variables: { logoutId: userProfile.id } });
      await client.resetStore();
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  const activeStyle = {
    color: '#f97316',
  };

  const firstNameLetter = `${userProfile.firstname.charAt(0).toUpperCase()}.`;

  let myAccountPath = '';
  if (userProfile.role === RoleEnum.ADMINISTRATEUR) {
    myAccountPath = '/admin/myaccount';
  } else if (userProfile.role === RoleEnum.OPERATEUR) {
    myAccountPath = '/operator/myaccount';
  }

  return (
    <div className="fixed f-between h-screen">
      <div className="pl-2 py-6 w-[15rem]">
        {userProfile.role === RoleEnum.ADMINISTRATEUR && (
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
        )} {userProfile.role === RoleEnum.OPERATEUR && (
        <div>
          <div className="ml-6 scale-125">
            <NavLink
              to="/operator/services"
            >
              <DarkLogo />
            </NavLink>
          </div>
          <h2 className="pb-8 nunito-bold text-xl mt-6">Opé. {firstNameLetter} {userProfile.lastname}          </h2>
          <OperatorMenu />
        </div>
        )}
      </div>
      <div className="pl-8">
        <NavLink
          to={myAccountPath}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          <div className="f-format-menu">
            <IdentificationIcon className="w-7 mr-4" />
            Mon compte
          </div>
        </NavLink>
        <div className="f-error-message flex flex-row pb-6 hover:underline decoration-2 cursor-pointer mb-6">
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
    </div>
  );
}

export default Menu;
