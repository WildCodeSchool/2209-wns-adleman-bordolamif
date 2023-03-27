import { useMutation } from '@apollo/client';
import AccountDetails from '@components/details/AccountDetails';
import { UPDATE_PASSWORD, UPDATE_USER } from '@graphQL/mutations/userMutations';
import { UserInput, UserUpdatePassword } from '@utils/types/InputTypes';
import { useUserProfile } from '@layouts/StaffLayout';

function MyAccountPage() {
  const { userProfile } = useUserProfile();
  const [UpdatePassword] = useMutation(UPDATE_PASSWORD);
  const [UpdateUser] = useMutation(UPDATE_USER);

  const handleUpdateProfile = async (data: UserInput, updateUserId:number) => {
    await UpdateUser({ variables: { data, updateUserId } });
  };
  const handleUpdatePassword = async (data:UserUpdatePassword) => {
    await UpdatePassword({ variables: { data } });
  };

  return (
    <div>
      <p>Mon compte</p>
      <p>{userProfile?.email}</p>
      <AccountDetails mode="profile" profile={userProfile} handleUpdateProfile={handleUpdateProfile} />
      <AccountDetails mode="password" profile={userProfile} handleUpdatePassword={handleUpdatePassword} />
    </div>

  );
}
export default MyAccountPage;
