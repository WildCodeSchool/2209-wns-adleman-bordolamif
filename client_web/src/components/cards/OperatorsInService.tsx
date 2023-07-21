import UserIcon from '@components/icons/UserIcon';
import { UserData } from '@utils/types/DataTypes';
import ManWithComputer from '../../assets/illustrations/ManWithComputer.png';

interface Props {
    connectedUsersList: UserData[]
}

function OperatorsInService(props:Props) {
  const { connectedUsersList } = props;

  return (

    <div className="rounded-2xl">
      {connectedUsersList! && connectedUsersList.length < 0
        ? (
          <>
            <h2 className="mt-6 text-2xl">Opérateurs sur le service</h2>
            {connectedUsersList.map((user) => (
              <div key={user.id} className="flex m-1 items-center">
                <UserIcon user={user} />
                <p className="ml-1">- {user.counter!.name}</p>
              </div>
            ))}
          </>
        )
        : <img className="w-[450px]" src={ManWithComputer} alt="ManWithComputer" />}
    </div>
  );
}

export default OperatorsInService;
