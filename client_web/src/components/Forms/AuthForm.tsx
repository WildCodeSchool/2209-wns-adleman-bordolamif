import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserConnexion } from '@utils/types/InputTypes';

interface Props {
    onLogin: (formData:UserConnexion) => void,
    error: string,
    loading: boolean
}

function AuthForm(props: Props) {
  const { onLogin, error, loading } = props;
  const { register, handleSubmit } = useForm<UserConnexion>();
  const [showPassword, setShowPassword] = useState(false);
  return (
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
          {error && <div>{error}</div>}
        </div>
      </div>
    </form>
  );
}

export default AuthForm;
