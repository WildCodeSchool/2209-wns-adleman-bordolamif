import { NavLink } from 'react-router-dom';

function Menu({ currentUser }:any) {
  return (
    <div> {currentUser !== undefined && (
    <div className="m-5 p-5 w-full">
      {currentUser.profile.role === 1 ? (
        <div>
          <h1 className="pb-5">Admin {currentUser.profile.email}</h1>
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
            <h1>Opérateur {currentUser.profile.email}</h1>
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
