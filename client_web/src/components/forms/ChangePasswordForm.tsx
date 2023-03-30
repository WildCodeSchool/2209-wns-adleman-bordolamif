import { useState } from 'react';
import { ChangePassword } from '@utils/types/InputTypes';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface Props {
  onChangePassword: (formData:ChangePassword) => void,
  error: string | null
}

function ChangePasswordForm(props:Props) {
  const { onChangePassword, error } = props;

  const [showPassword, setShowPassword] = useState(false);
  const { reset, register, handleSubmit } = useForm<ChangePassword>();
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [checkPasswordValue, setCheckPasswordValue] = useState('');

  const onSubmit = (formData: ChangePassword) => {
    onChangePassword(formData);
    reset();
  };

  const handleChangeNewPassword = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setNewPasswordValue(newValue);
  };

  const handleChangeCheckPassword = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setCheckPasswordValue(newValue);
  };

  const iconProps = {
    className: 'absolute right-6 top-2 w-7 text-gray-700 hover:text-orange-600 cursor-pointer select-none',
    onClick: () => setShowPassword(!showPassword),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <LockClosedIcon className="f-auth-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nouveau mot de passe"
            {...register('newPassword', { onChange: handleChangeNewPassword, value: newPasswordValue })}
            className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-8"
          />
          {showPassword ? (
            <EyeIcon {...iconProps} />
          ) : (
            <EyeSlashIcon {...iconProps} />
          )}
        </div>
        <div className="relative">
          <LockClosedIcon className="f-auth-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Verifier le mot de passe"
            {...register('checkPassword', { onChange: handleChangeCheckPassword, value: checkPasswordValue })}
            className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-8"
          />
        </div>
        <button
          type="submit"
          disabled={newPasswordValue !== checkPasswordValue || newPasswordValue.length < 8}
          className="drop-shadow disabled:cursor-default transition-all hover:bg-orange-600 duration-500 disabled:bg-gray-300 bg-orange-500 text-white py-2 px-4 rounded w-1/3 cursor-pointer"
        >
          Valider
        </button>
        {error && <div className="text-red-600 w-80 mt-4 text-center text-sm">{error}</div>}
      </div>
    </form>
  );
}

export default ChangePasswordForm;
