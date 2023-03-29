import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserConnexion } from '@utils/types/InputTypes';
import {
  EyeIcon, EyeSlashIcon, AtSymbolIcon, LockClosedIcon,
} from '@heroicons/react/24/solid';
import { XCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import Loader from '@assets/Loader';
import WomanWithCommputer from '../../assets/illustrations/WomanWithComputer.png';

interface Props {
    onLogin: (formData:UserConnexion) => void,
    error: string,
    loading: boolean
}

function AuthForm(props: Props) {
  const { onLogin, error, loading } = props;
  const { register, handleSubmit } = useForm<UserConnexion>();
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setemailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setemailValue(newValue);
  };

  const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setPasswordValue(newValue);
  };

  const iconProps = {
    className: 'absolute transition-all duration-300 right-6 top-2 w-7 text-gray-500 hover:text-orange-600 cursor-pointer select-none',
    onClick: () => setShowPassword(!showPassword),
  };

  return (
    <div className="flex flex-row items-center gap-20 scale-125">
      <div className="absolute -top-20">
        <h2 className="text-3xl nunito-bold">
          Bienvenue sur Wait
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 nunito-regular">
            it
          </span>
        </h2>
        <p className="text-xl">Le gestionnaire de flux d’attente spécialisé</p>
        <p className="text-xl">dans les établissements de santé</p>
      </div>
      <div>
        <img className="w-[500px]" src={WomanWithCommputer} alt="WomanWithComputer" />
      </div>
      <div>
        <form onSubmit={handleSubmit(onLogin)} className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
          <div className="flex flex-col items-center">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 nunito-bold text-3xl mb-8">Connexion</h2>
            <div className="relative">
              <AtSymbolIcon className="f-auth-icon" />
              <input
                placeholder="Email"
                {...register('email', { onChange: handleChangeEmail, value: emailValue })}
                className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="f-auth-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                {...register('password', { onChange: handleChangePassword, value: passwordValue })}
                className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-8"
              />
              {showPassword ? (
                <EyeIcon {...iconProps} />
              ) : (
                <EyeSlashIcon {...iconProps} />
              )}
            </div>
            <button
              type="submit"
              disabled={!emailValue.includes('@') || passwordValue.length < 8}
              className="flex justify-around drop-shadow disabled:cursor-default transition-all hover:bg-orange-600 duration-500 disabled:bg-gray-300 bg-orange-500 text-white py-2 px-4 rounded w-3/6 cursor-pointer"
            >
              <div>
                {!emailValue.includes('@') || passwordValue.length < 8 ? (
                  <XCircleIcon className="absolute left-2 top-2 w-6" />
                ) : (
                  <ArrowRightCircleIcon className="absolute left-2 top-2 w-6" />
                )}
              </div>
              <p>
                Se connecter
              </p>
            </button>
            <div className="mt-4">
              {loading && (
              <div className="flex flex-row justify-center items-center">
                <div className="mr-4">Connexion...</div>
                <Loader />
              </div>
              )}
              {error && <div className="text-red-600">{error}</div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
