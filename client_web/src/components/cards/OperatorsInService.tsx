import UserIcon from '@components/icons/UserIcon';
import { UserData } from '@utils/types/DataTypes';

interface Props {
    connectedUsersList: UserData[]
}

function OperatorsInService(props:Props) {
  const { connectedUsersList } = props;
  return (

    <div className="rounded-2xl">
      <h2 className="f-dashboard-titles">Opérateurs sur le service</h2>
      {connectedUsersList! && connectedUsersList.map((user) => (
        <div key={user.id} className="flex m-1 items-center">
          <UserIcon user={user} />
          <p className="ml-1">- {user.counter!.name}</p>
        </div>
      ))}
    </div>
  );
}

export default OperatorsInService;
