import AccountCard from '@components/cards/AccountCard';
import { useUserProfile } from '@layouts/StaffLayout';
import { useState } from 'react';
import AccountMan from '../assets/illustrations/AccountMan.png';

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
      <div>
        <div className="f-format-account">
          <div className="flex flex-col gap-6">
            <h2 className="text-5xl">Bonjour,</h2>
            <h2 className="text-5xl nunito-bold">{userProfile.firstname} {userProfile.lastname}</h2>
          </div>
          <img className="w-[350px]" src={AccountMan} alt="AccountMan" />
        </div>
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
