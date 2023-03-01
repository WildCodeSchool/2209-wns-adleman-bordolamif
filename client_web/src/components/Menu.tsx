import { ApolloClient } from '@apollo/client';
import { UserProfile } from '@utils/types/DataTypes';
import AdminMenu from './menu/AdminMenu';
import OperatorMenu from './menu/OperatorMenu';

interface Props {
  userProfile: UserProfile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

function Menu({ userProfile, client }:Props) {
  return (
    <div> {userProfile !== undefined && (
    <div className="pl-2 py-6 w-[15rem]">
      {userProfile.role === 1 ? (
        <AdminMenu userProfile={userProfile} client={client} />
      ) : (
        <OperatorMenu userProfile={userProfile} />
      )}
    </div>
    )}
    </div>

  );
}
export default Menu;
