import { ApolloClient } from '@apollo/client';
import Menu from '@components/menu/Menu';
import { UserData } from '@utils/types/DataTypes';
import { Outlet, useOutletContext } from 'react-router';

interface Props {
  currentUser: UserData | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

type ContextType = {userProfile: UserData | null}

function StaffLayout(props:Props) {
  const { currentUser, client } = props;

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen">
      {currentUser && currentUser! ? (
        <div className="flex w-[85rem]">
          <Menu userProfile={currentUser} client={client} />
          <div className="w-full bg-white m-5 p-5 rounded-xl shadow-xl ml-[16rem]">
            <Outlet context={{ userProfile: currentUser }} />
          </div>
        </div>
      ) : <p>Vous n'êtes pas autorisé à être ici</p>}
    </div>
  );
}

export default StaffLayout;

export function useUserProfile() {
  return useOutletContext<ContextType>();
}
