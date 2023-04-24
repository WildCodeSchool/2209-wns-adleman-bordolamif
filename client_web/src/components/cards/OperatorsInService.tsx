import { UserData } from '@utils/types/DataTypes';

interface Props {
    connectedUsersList: UserData[]
}

function OperatorsInService(props:Props) {
  const { connectedUsersList } = props;
  return (

    <div className="rounded-2xl">
      <h2 className="f-dashboard-titles text-center">Opérateurs sur le service</h2>
      {connectedUsersList! && connectedUsersList.map((user) => (
        <div key={user.id} className="flex m-1">
          <div className="bg-orange-500 rounded text-white p-1">{user.firstname.toUpperCase().split('')[0] + user.lastname.toUpperCase().split('')[0]}</div>
          <p>{user.firstname.toUpperCase().split('')[0]}. {user.lastname.charAt(0).toUpperCase() + user.lastname.toLowerCase().slice(1)} - Guichet {user.counter!.name}</p>
        </div>
      ))}
    </div>
  );
}

export default OperatorsInService;
