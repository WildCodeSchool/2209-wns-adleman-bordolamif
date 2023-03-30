import { useState } from 'react';
import { ChangePassword } from '@utils/types/InputTypes';
import { UserProfile } from '@utils/types/DataTypes';
import { ApolloClient, useMutation } from '@apollo/client';
import { LOGOUT, UPDATE_USER_PASSWORD } from '@graphQL/mutations/userMutations';
import { useNavigate } from 'react-router';
import ChangePasswordForm from '@components/forms/ChangePasswordForm';

interface Props {
  currentUser: UserProfile,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

function FirstConnectionPage(props:Props) {
  const { currentUser, client } = props;

  const [error, setError] = useState<string | null>(null);

  const [firstLoginPassword] = useMutation(UPDATE_USER_PASSWORD);
  const [logout] = useMutation(LOGOUT);

  const navigate = useNavigate();
  const onChangePassword = async (formData: ChangePassword) => {
    const { newPassword, checkPassword } = formData;
    try {
      if (newPassword === checkPassword) {
        await firstLoginPassword({
          variables: {
            data: { email: currentUser.email, newPassword },
          },

        });
        await logout({ variables: { logoutId: currentUser.id } });
        await client.resetStore();
        navigate('/');
      } else {
        setError('Mot de passe different');
      }
    } catch (e) {
      setError('Votre nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
  };
  return (
    <div className="flex justify-center items-center bg-gray-200 min-h-screen">
      <div className="flex flex-col justify-center bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 h-fit">
        <h2 className="mb-6">Veuillez renseigner votre nouveau mot de passe</h2>
        <ChangePasswordForm onChangePassword={onChangePassword} error={error} />
      </div>
    </div>
  );
}

export default FirstConnectionPage;
