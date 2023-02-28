import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserConnexion } from '@utils/types/InputTypes';
import {
  EyeIcon, EyeSlashIcon, AtSymbolIcon, LockClosedIcon,
} from '@heroicons/react/24/solid';
import DarkLogo from '@assets/DarkLogo';

interface Props {
    onLogin: (formData:UserConnexion) => void,
    error: string,
    loading: boolean
}

function AuthForm(props: Props) {
  const { onLogin, error, loading } = props;
  const { register, handleSubmit } = useForm<UserConnexion>();
  const [showPassword, setShowPassword] = useState(false);

  const iconProps = {
    className: 'absolute right-6 top-2 w-7 text-gray-700 hover:text-orange-600 cursor-pointer select-none',
    onClick: () => setShowPassword(!showPassword),
  };

  return (
    <div>
      <div className="flex flex-col items-center scale-125">
        <form onSubmit={handleSubmit(onLogin)} className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
          <div className="flex flex-col items-center">
            <h1 className="mb-6 text-gray-700 nunito-bold text-xl">Connexion</h1>
            <div className="relative">
              <AtSymbolIcon className="absolute left-2 top-2 w-6 text-orange-500" />
              <input
                placeholder="Email"
                {...register('email')}
                className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute left-2 top-2 w-6 text-orange-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                {...register('password')}
                className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
              />
              {showPassword ? (
                <EyeIcon {...iconProps} />
              ) : (
                <EyeSlashIcon {...iconProps} />
              )}
            </div>
            <button
              type="submit"
              className="drop-shadow bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-3/6"
            >
              Se connecter
            </button>
            <div>
              {loading && <div>Submitting ...</div>}
              {error && <div>{error}</div>}
            </div>
          </div>
        </form>
        <DarkLogo />
      </div>
    </div>
  );
}

export default AuthForm;
