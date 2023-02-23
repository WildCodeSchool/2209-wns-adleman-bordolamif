import { ApolloClient } from '@apollo/client';
import Menu from '@components/Menu';
import { UserProfile } from '@utils/types/DataTypes';
import { Outlet } from 'react-router';

interface Props {
  currentUser: UserProfile | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

function StaffLayout(props:Props) {
  const { currentUser, client } = props;

  return (
    <div>
      {currentUser && currentUser! ? (
        <div className="flex bg-gray-200 h-screen">
          <Menu userProfile={currentUser} client={client} />
          <div className="w-full bg-white m-5 p-5 rounded">
            <Outlet context={{ userProfile: currentUser }} />
          </div>
        </div>
      ) : <p>Unauthorized</p>}
    </div>
  );
}
export default StaffLayout;
