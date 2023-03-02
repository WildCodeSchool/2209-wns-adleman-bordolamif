import { NavLink } from 'react-router-dom';
import { UserProfile } from '@utils/types/DataTypes';

interface Props {
  userProfile: UserProfile
}

function OperatorMenu({ userProfile }: Props) {
  const firstNameLetter = `${userProfile.firstname.charAt(0).toUpperCase()}.`;
  return (
    <div>
      <h1
        className="pb-12 nunito-bold text-xl"
      >Opérateur {firstNameLetter} {userProfile.lastname}
      </h1>
      <ul className="flex flex-col pb-10 pl-4">
        <NavLink to="/operator">Mise en service</NavLink>
        <NavLink to="/operator/board">Tableau de bord</NavLink>
      </ul>
    </div>
  );
}

export default OperatorMenu;
