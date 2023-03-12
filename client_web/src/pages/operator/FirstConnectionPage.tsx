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
            firstLoginPasswordId: currentUser.id,
          },

        });
        await logout();
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
    <div>
      <h1>veuillez renseigner votre nouveau mot de passe</h1>
      <ChangePasswordForm onChangePassword={onChangePassword} error={error} />
    </div>
  );
}

export default FirstConnectionPage;
