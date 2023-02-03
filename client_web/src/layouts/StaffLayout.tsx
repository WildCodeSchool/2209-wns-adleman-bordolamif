import { useQuery } from '@apollo/client';
import Menu from '@components/Menu';
import { PROFILE } from '@graphQL/query/userQuery';
import { Outlet } from 'react-router';

function StaffLayout() {
  const { data: currentUser } = useQuery(PROFILE, { errorPolicy: 'ignore' });

  return (
    <div>
      {currentUser !== undefined ? (
        <div className="flex bg-gray-200 h-screen">
          <Menu userProfile={currentUser.profile} />
          <div className="w-full bg-white m-5 p-5 rounded">
            <Outlet context={{ userProfile: currentUser.profile }} />
          </div>
        </div>
      ) : <p>Unauthorized</p>}
    </div>
  );
}
export default StaffLayout;
