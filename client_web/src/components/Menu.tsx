import { NavLink } from 'react-router-dom';

function Menu({ currentUser }:any) {
  return (
    <div> {currentUser !== undefined && (
    <div>
      <h1>{currentUser.profile.email}</h1>
      {currentUser.profile.role === 1 ? (
        <div>
          <ul className="flex flex-col">
            <NavLink to="/admin">Tableau de bord</NavLink>
            <NavLink to="/admin/services">Gérer les services</NavLink>
            <NavLink to="/admin/counters">Gérer les guichets</NavLink>
            <NavLink to="/admin/statistics">Statistiques</NavLink>
          </ul>
          <div>
            <NavLink to="/admin/users">Gérer les opérateurs</NavLink>
            <ul className="flex flex-col">
              <NavLink to="/admin/users/create">Créer un opérateur</NavLink>
              <NavLink to="/admin/users/update">Modifier un opérateur</NavLink>
              <NavLink to="/admin/users/delete">Supprimer un opérateur</NavLink>
            </ul>
          </div>
        </div>
      )
        : (
          <div>
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
