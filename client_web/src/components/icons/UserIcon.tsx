import { UserData } from '@utils/types/DataTypes';

interface Props {
    user: UserData
}

function UserIcon(props: Props) {
  const { user } = props;
  return (
    <div className="flex items-center">
      <div className="bg-orange-500 rounded text-white p-1 mr-2 my-1 w-8 text-center">{user.firstname.toUpperCase().split('')[0] + user.lastname.toUpperCase().split('')[0]}

      </div>
      <p>{user.firstname.toUpperCase().split('')[0]}. {user.lastname.charAt(0).toUpperCase() + user.lastname.toLowerCase().slice(1)}</p>
    </div>
  );
}

export default UserIcon;
