import AccountCard from '@components/cards/AccountCard';
import { useUserProfile } from '@layouts/StaffLayout';
import { useState } from 'react';

function MyAccountPage() {
  const { userProfile } = useUserProfile();

  const [modeToUpdate, setModeToUpdate] = useState<string>('');

  return (
    <div>
      <p>Mon compte</p>
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
