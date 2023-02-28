import { ApolloClient, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { LOGIN, LOGOUT } from '@graphQL/mutations/userMutations';
import { UserConnexion } from '@utils/types/InputTypes';
import { useNavigate } from 'react-router';
import { UserProfile } from '@utils/types/DataTypes';
import AuthForm from '@components/forms/AuthForm';

interface Props {
  currentUser: UserProfile | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>
}

function AuthPage(props: Props) {
  const { currentUser, client } = props;
  const [error, setError] = useState('');
  const [login, { loading }] = useMutation(LOGIN);
  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();

  const onLogin = async (formData:UserConnexion) => {
    try {
      await login({ variables: { data: formData } });
      await client.resetStore();
    } catch (e) {
      setError('Email ou mot de passe incorrect');
    }
  };

  useEffect(() => {
    if (currentUser && currentUser!.role === 1) {
      setTimeout(() => navigate('/admin'), 2000);
    }
  }, [currentUser, navigate]);

  const onLogout = async () => {
    await logout();
    await client.resetStore();
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-200">
      {currentUser ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
          <div className="flex flex-col items-center">
            <p className="mb-7 text-gray-700">logged in as {currentUser.email}</p>
            <button type="button" onClick={onLogout} className="shadow bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-3/6">Log out</button>
          </div>
        </div>
      ) : (
        <AuthForm
          onLogin={onLogin}
          error={error}
          loading={loading}
        />
      )}
    </div>
  );
}

export default AuthPage;
