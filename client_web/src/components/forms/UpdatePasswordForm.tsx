import { UserData } from '@utils/types/DataTypes';
import {
  UpdatePassword, UserUpdatePassword,
} from '@utils/types/InputTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    profile: UserData
    handleUpdatePassword: (data: UserUpdatePassword, id: number) =>void
    setIsUpdatePassword: (isEdit: boolean) => void
}

function UpdatePasswordForm(props: Props) {
  const {
    profile,
    handleUpdatePassword, setIsUpdatePassword,
  } = props;

  const [error, setError] = useState('');

  const {
    register, watch, getValues, handleSubmit,
  } = useForm<UpdatePassword>();

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data:UpdatePassword) => {
    try {
      if (data.newPassword !== data.confirmPassword) setError('new passwords does not match');
      const passwordToUpdate = {
        oldPassword: data.oldPassword,
        email: profile.email,
        newPassword: data.newPassword,
      };
      await handleUpdatePassword(passwordToUpdate, profile.id);
      setIsUpdatePassword(false);
    } catch (submitError) {
      setError('Error while trying to edit Profile');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div>
        <input placeholder="oldPassword" {...register('oldPassword')} required className={inputClassName} />
        <input placeholder="New password" {...register('newPassword')} required className={inputClassName} />
        <input placeholder="Confirm password" {...register('confirmPassword')} required className={inputClassName} />
        {watch('confirmPassword') !== watch('newPassword') && getValues('confirmPassword') ? (<p>password not match</p>) : null}
      </div>

      <div className="flex">
        <button
          className="p-2 mx-2 w-[5rem] bg-red-600 rounded text-white hover:bg-red-700"
          type="button"
          onClick={() => setIsUpdatePassword(false)}
        >
          Annuler
        </button>
        <button
          className="p-2 mx-2 w-fit bg-green-600 rounded text-white hover:bg-green-700"
          type="submit"
        >
          Valider
        </button>
        <div>
          {error && <div>{error}</div>}
        </div>
      </div>
    </form>
  );
}

export default UpdatePasswordForm;
