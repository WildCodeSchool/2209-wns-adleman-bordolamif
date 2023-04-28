import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@graphQL/mutations/userMutations';
import { UserData } from '@utils/types/DataTypes';
import { UserInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props{
  profile: UserData
  setModeToUpdate: (mode: string) => void
}

function UpdateProfileForm(props: Props) {
  const {
    profile,
    setModeToUpdate,
  } = props;

  const [UpdateUser] = useMutation(UPDATE_USER);

  const [error, setError] = useState('');

  const formDefaultValues = {
    lastname: profile.lastname,
    firstname: profile.firstname,
    email: profile.email,
  };

  const {
    register, handleSubmit,
  } = useForm<UserInput>({
    defaultValues: formDefaultValues,
  });

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data:UserInput) => {
    try {
      const servicesId = profile.services
        ? profile.services.map((service) => ({ id: service.id })) : [];
      const profileToUpdate = {
        lastname: data.lastname,
        firstname: data.firstname,
        email: data.email,
        role: profile.role,
        counter: profile.counter ? { id: profile.counter.id } : null,
        services: servicesId,
        currentService: profile.currentService ? { id: profile.currentService.id } : null,
      };
      await UpdateUser({ variables: { data: profileToUpdate, updateUserId: profile.id } });
      setModeToUpdate('');
    } catch (submitError) {
      setError("Une erreur est survenue lors de l'édition de votre profile");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input placeholder="Nom" {...register('lastname')} required className={inputClassName} />
        <input placeholder="Prénom" {...register('firstname')} required className={inputClassName} />
        <input placeholder="Email" {...register('email')} required className={inputClassName} />
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

export default UpdateProfileForm;
