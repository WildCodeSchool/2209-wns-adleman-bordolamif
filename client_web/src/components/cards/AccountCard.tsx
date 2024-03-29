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
    <div className="f-format-gray-rounded">
      <div className="flex justify-between px-2">
        { cardMode === PROFILE && (
          <div>
            <h2 className="text-2xl mb-8">Mes informations personnelles</h2>
            <p className="f-account-props">Nom : <span className="nunito-regular">{profile.lastname}</span></p>
            <p className="f-account-props">Prénom : <span className="nunito-regular">{profile.firstname}</span></p>
            <p className="f-account-props">Email : <span className="nunito-regular">{profile.email}</span></p>
          </div>
        )}
        { cardMode === PASSWORD && (
        <div>
          <h2 className="text-2xl mb-8">Mon mot de passe</h2>
        </div>
        )}
        {((modeToUpdate !== PROFILE && cardMode === PROFILE)
        || (modeToUpdate !== PASSWORD && cardMode === PASSWORD))
        && (
        <div>
          <button
            className="f-button-orange"
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
