import UpdateAccountForm from '@components/forms/UpdateAccountForm';
import UpdatePasswordForm from '@components/forms/UpdatePasswordForm';
import { UserData } from '@utils/types/DataTypes';
import {
  UserInput, UserUpdatePassword,
} from '@utils/types/InputTypes';
import { useState } from 'react';

interface RequiredProps {
    profile: UserData,
    mode: string,
}

interface OptionalProps {
    handleUpdateProfile?: null | ((data: UserInput, id: number) => void)
    handleUpdatePassword?: null | ((data: UserUpdatePassword, id: number) =>void)
}

interface Props extends RequiredProps, OptionalProps{}

const defaultProps: OptionalProps = {
  handleUpdatePassword: null,
  handleUpdateProfile: null,
};

function AccountDetails(props: Props) {
  const {
    profile,
    mode,
    handleUpdateProfile,
    handleUpdatePassword,
  } = props;

  const [isUpdateProfile, setIsUpdateProfile] = useState<boolean>(false);

  const [isUpdatePassword, setIsUpdatePassword] = useState<boolean>(false);

  const handleUpdate = (modeToUpdate: string) => {
    if (modeToUpdate === 'password') {
      setIsUpdatePassword(true);
    } else {
      setIsUpdateProfile(true);
    }
  };

  return (
    <div className="bg-gray-200 p-4 my-2 rounded">
      <div className="flex bg-gray-200 justify-between px-2">
        {mode === 'profile' && (
        <div>
          <h2>Mes informations personnelles</h2>
          <p>Nom: {profile.lastname}</p>
          <p>Prénom: {profile.firstname}</p>
          <p> Email: {profile.email}</p>
        </div>
        )}
        { mode === 'password' && (
        <div>
          <h2>Mon mot de passe</h2>
        </div>
        )}
        {((!isUpdateProfile && mode === 'profile') || (!isUpdatePassword && mode === 'password'))
        && (
        <div>
          <button
            type="button"
            onClick={() => handleUpdate(mode)}
          >
            Update
          </button>
        </div>
        )}
      </div>
      {isUpdatePassword && handleUpdatePassword && (
      <UpdatePasswordForm
        profile={profile}
        handleUpdatePassword={handleUpdatePassword}
        setIsUpdatePassword={setIsUpdatePassword}
      />
      )}

      {isUpdateProfile && handleUpdateProfile && (
      <UpdateAccountForm
        profile={profile}
        handleUpdateProfile={handleUpdateProfile}
        setIsUpdateProfile={setIsUpdateProfile}
      />
      )}

    </div>
  );
}

AccountDetails.defaultProps = defaultProps;

export default AccountDetails;
