import { useMutation } from '@apollo/client';
import { UPDATE_PASSWORD } from '@graphQL/mutations/userMutations';
import { UserData } from '@utils/types/DataTypes';
import {
  UpdatePassword,
} from '@utils/types/InputTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    profile: UserData
    setModeToUpdate: (mode: string) => void
  }

function UpdatePasswordForm(props: Props) {
  const {
    profile, setModeToUpdate,
  } = props;

  const [error, setError] = useState('');
  const [UpdateUserPassword] = useMutation(UPDATE_PASSWORD);

  const {
    register, watch, getValues, handleSubmit,
  } = useForm<UpdatePassword>();

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data:UpdatePassword) => {
    try {
      if (data.newPassword !== data.confirmPassword) setError('Les nouveaux mots de passe ne sont pas identique');
      const passwordToUpdate = {
        oldPassword: data.oldPassword,
        email: profile.email,
        newPassword: data.newPassword,
      };
      await UpdateUserPassword({ variables: { data: passwordToUpdate } });
      setModeToUpdate('');
    } catch (submitError) {
      setError('Une erreur est survenue lors du changement de votre mot de passe');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div>
        <input placeholder="Ancien mot de passe" {...register('oldPassword')} required className={inputClassName} />
        <input placeholder="Nouveau mot de passe" {...register('newPassword')} required className={inputClassName} />
        <input placeholder="Confirmation du nouveau mot de passe" {...register('confirmPassword')} required className={inputClassName} />
        {watch('confirmPassword') !== watch('newPassword') && getValues('confirmPassword') ? (<p>Les nouveaux mots de passe ne sont pas identiques</p>) : null}
      </div>

      <div className="flex gap-4">
        <button
          className="f-button-white-red"
          type="button"
          onClick={() => setModeToUpdate('')}
        >
          Annuler
        </button>
        <button
          className="f-button-white-green"
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
