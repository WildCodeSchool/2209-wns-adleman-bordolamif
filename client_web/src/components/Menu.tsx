import { UserProfile } from '@utils/types/DataTypes';
import { NavLink } from 'react-router-dom';

interface Props {
  userProfile: UserProfile
}

function Menu({ userProfile }:Props) {
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
