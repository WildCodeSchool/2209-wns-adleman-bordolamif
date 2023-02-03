import { ApolloClient, useMutation } from '@apollo/client';
import { LOGOUT } from '@graphQL/mutations/userMutations';
import { UserProfile } from '@utils/types/DataTypes';
import { NavLink, useNavigate } from 'react-router-dom';

interface Props {
  userProfile: UserProfile
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

  return (
    <div> {userProfile !== undefined && (
    <div className="m-5 p-5 w-full">
      {userProfile.role === 1 ? (
        <div>
          <h1 className="pb-5">Admin {userProfile.lastname} {userProfile.firstname}</h1>
          <ul className="flex flex-col pb-5">
            <NavLink className="pb-2" to="/admin">Tableau de bord</NavLink>
            <NavLink className="pb-2" to="/admin/services">Gérer les services</NavLink>
            <NavLink className="pb-2" to="/admin/counters">Gérer les guichets</NavLink>
            <NavLink className="pb-2" to="/admin/statistics">Statistiques</NavLink>
          </ul>
          <div className="bg-white p-2 rounded -ml-2">
            <NavLink className="text-orange-500" to="/admin/users">Opérateurs</NavLink>
            <ul className="flex flex-col">
              <NavLink className="py-2 pl-3" to="/admin/users/create">Créer un opérateur</NavLink>
              <NavLink className="pb-2 pl-3" to="/admin/users/update">Modifier un opérateur</NavLink>
              <NavLink className="pb-2 pl-3" to="/admin/users/delete">Supprimer un opérateur</NavLink>
            </ul>
          </div>
          <button type="button" onClick={onLogout} className="shadow bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-3/6">Log out</button>

        </div>
      )
        : (
          <div>
            <h1>Opérateur {userProfile.email}</h1>
            <ul>
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
