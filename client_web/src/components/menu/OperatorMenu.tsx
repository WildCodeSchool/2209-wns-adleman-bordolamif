import { NavLink } from 'react-router-dom';

function OperatorMenu() {
  return (
    <div>
      <ul className="flex flex-col pb-10 pl-4">
        <NavLink to="/operator">Mise en service</NavLink>
        <NavLink to="/operator/board">Tableau de bord</NavLink>
      </ul>
    </div>
  );
}

export default OperatorMenu;
