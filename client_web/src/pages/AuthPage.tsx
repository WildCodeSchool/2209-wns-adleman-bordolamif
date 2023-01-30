/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { LOGIN, LOGOUT } from '@graphQL/mutations/userMutations';
import { PROFILE } from '@graphQL/query/userQuery';
import { UserConnexion } from 'src/utils/types/inputTypes';

function AuthPage() {
  const { register, handleSubmit } = useForm<UserConnexion>();
  const [error, setError] = useState('');
  const [login, { loading }] = useMutation(LOGIN);
  const [logout] = useMutation(LOGOUT);
  const { data: currentUser, client } = useQuery(PROFILE, { errorPolicy: 'ignore' });
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async (formData:UserConnexion) => {
    try {
      await login({ variables: { data: formData } });
      await client.resetStore();
    } catch (e) {
      setError('invalid Credentials');
    }
  };

  const onLogout = async () => {
    await logout();
    await client.resetStore();
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-200">
      {currentUser ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
          <div className="flex flex-col items-center">
            <p className="mb-7 text-gray-700">logged in as {currentUser.profile.email}</p>
            <button type="button" onClick={onLogout} className="shadow bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-3/6">Log out</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onLogin)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
          <div className="flex flex-col items-center">
            <h1 className="mb-7 text-gray-700">Connexion</h1>
            <input placeholder="email" {...register('email')} className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7" />
            <div className="flex w-full mb-7">
              <input type={showPassword ? 'text' : 'password'} placeholder="password" {...register('password')} className="border rounded py-2 px-3 text-gray-700 focus:outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="shadow bg-orange-500 hover:bg-orange-600 text-white rounded">
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <button type="submit" className="shadow bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-3/6">Se connecter</button>
            <div>
              {loading && <div>Submitting ...</div>}
              {error && <div>`Submission error ! ${error}`</div>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AuthPage;
