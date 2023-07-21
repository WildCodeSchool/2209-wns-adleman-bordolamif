import UserIcon from '@components/icons/UserIcon';
import { UserData } from '@utils/types/DataTypes';
import ManWithComputer from '../../assets/illustrations/ManWithComputer.png';

interface RequiredProps {
  connectedUsersList: UserData[]
}
interface OptionalProps {
mode?: string | null
}

interface Props extends RequiredProps, OptionalProps{}

const defaultProps:OptionalProps = {
  mode: null,
};

function OperatorsInService(props:Props) {
  const { connectedUsersList, mode } = props;

  return (

    <div className="rounded-2xl">
      {connectedUsersList! && connectedUsersList.length > 0
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
        : mode! && <img className="w-[450px]" src={ManWithComputer} alt="ManWithComputer" />}
    </div>
  );
}

OperatorsInService.defaultProps = defaultProps;

export default OperatorsInService;
