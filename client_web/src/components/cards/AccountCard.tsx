import UpdatePasswordForm from '@components/forms/UpdatePasswordForm';
import { UserData } from '@utils/types/DataTypes';
import UpdateProfileForm from '@components/forms/UpdateProfileForm';

interface Props {
    profile: UserData,
    cardMode: string,
    modeToUpdate: string,
    setModeToUpdate: (mode: string)=> void
}

const PASSWORD = 'password';
const PROFILE = 'profile';

function AccountCard(props: Props) {
  const {
    profile,
    modeToUpdate,
    setModeToUpdate,
    cardMode,
  } = props;

  return (
    <div className="bg-gray-200 p-4 my-2 rounded">
      <div className="flex bg-gray-200 justify-between px-2">
        {cardMode === PROFILE && (
        <div>
          <h2>Mes informations personnelles</h2>
          <p>Nom: {profile.lastname}</p>
          <p>Prénom: {profile.firstname}</p>
          <p> Email: {profile.email}</p>
        </div>
        )}
        { cardMode === PASSWORD && (
        <div>
          <h2>Mon mot de passe</h2>
        </div>
        )}
        {((modeToUpdate !== PROFILE && cardMode === PROFILE)
        || (modeToUpdate !== PASSWORD && cardMode === PASSWORD))
        && (
        <div>
          <button
            type="button"
            onClick={() => setModeToUpdate(cardMode)}
          >
            Mettre à jour
          </button>
        </div>
        )}
      </div>
      {modeToUpdate === PASSWORD && cardMode === PASSWORD && (
      <UpdatePasswordForm
        profile={profile}
        setModeToUpdate={setModeToUpdate}
      />
      )}
      {modeToUpdate === PROFILE && cardMode === PROFILE && (
      <UpdateProfileForm
        profile={profile}
        setModeToUpdate={setModeToUpdate}
      />
      )}

    </div>
  );
}

export default AccountCard;
