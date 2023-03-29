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

  const onSubmit = (formData: ChangePassword) => {
    onChangePassword(formData);
    reset();
  };

  const iconProps = {
    className: 'absolute right-6 top-2 w-7 text-gray-700 hover:text-orange-600 cursor-pointer select-none',
    onClick: () => setShowPassword(!showPassword),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showPassword ? (
        <EyeIcon {...iconProps} />
      ) : (
        <EyeSlashIcon {...iconProps} />
      )}
      <div className="relative">
        <LockClosedIcon className="absolute left-2 top-2 w-6 text-orange-500" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Nouveau mot de passe"
          {...register('newPassword')}
          className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
        />
      </div>
      <div className="relative">
        <LockClosedIcon className="absolute left-2 top-2 w-6 text-orange-500" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Verifier le mot de passe"
          {...register('checkPassword')}
          className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="f-button-green"
      >
        Valider
      </button>
    </form>
  );
}

export default ChangePasswordForm;
