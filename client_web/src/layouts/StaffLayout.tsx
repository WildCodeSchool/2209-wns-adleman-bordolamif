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
    <div className="flex justify-center bg-gray-200 min-h-screen">
      {currentUser && currentUser! ? (
        <div className="flex w-[80rem]">
          <Menu userProfile={currentUser} client={client} />
          <div className="w-full bg-white m-5 p-5 rounded-xl shadow-xl">
            <Outlet context={{ userProfile: currentUser }} />
          </div>
        </div>
      ) : <p>Vous n'êtes pas autorisé à être ici</p>}
    </div>
  );
}
export default StaffLayout;
