import { useQuery } from '@apollo/client';
import Menu from '@components/Menu';
import { PROFILE } from '@graphQL/query/userQuery';
import { Outlet } from 'react-router';

function StaffLayout() {
  const { data: currentUser } = useQuery(PROFILE, { errorPolicy: 'ignore' });

  return (
    <div>
      {currentUser !== undefined ? (
        <div className="flex">
          <Menu currentUser={currentUser} />
          <Outlet context={{ currentUser }} />
        </div>
      ) : <p>Unauthorized</p>}
    </div>
  );
}
export default StaffLayout;
