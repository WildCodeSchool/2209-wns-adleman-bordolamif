import AccountCard from '@components/cards/AccountCard';
import { useUserProfile } from '@layouts/StaffLayout';
import { useState } from 'react';

function MyAccountPage() {
  const { userProfile } = useUserProfile();

  const [modeToUpdate, setModeToUpdate] = useState<string>('');

  return (
    <div>
      <div className="f-title-format">
        <h1 className="f-main-title">Mon compte</h1>
        <div className="f-decoration-line" />
      </div>
      {userProfile
      && (
      <div><p>{userProfile.email}</p>
        <AccountCard
          cardMode="profile"
          profile={userProfile}
          modeToUpdate={modeToUpdate}
          setModeToUpdate={setModeToUpdate}
        />
        <AccountCard
          cardMode="password"
          profile={userProfile}
          modeToUpdate={modeToUpdate}
          setModeToUpdate={setModeToUpdate}
        />
      </div>
      )}

    </div>

  );
}
export default MyAccountPage;
