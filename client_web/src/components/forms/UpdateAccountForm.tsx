import { UserData } from '@utils/types/DataTypes';
import { UserInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props{
  profile: UserData
  handleUpdateProfile: (data: UserInput, id: number) => void
  setIsUpdateProfile: (isEdit: boolean) => void
}

function UpdateAccountForm(props: Props) {
  const {
    profile, handleUpdateProfile, setIsUpdateProfile,
  } = props;

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
      await handleUpdateProfile(profileToUpdate, profile.id);
      setIsUpdateProfile(false);
    } catch (submitError) {
      setError('Error while trying to edit Profile');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input placeholder="lastname" {...register('lastname')} required className={inputClassName} />
        <input placeholder="firstname" {...register('firstname')} required className={inputClassName} />
        <input placeholder="email" {...register('email')} required className={inputClassName} />
      </div>
      <div className="flex">
        <button
          className="p-2 mx-2 w-[5rem] bg-red-600 rounded text-white hover:bg-red-700"
          type="button"
          onClick={() => setIsUpdateProfile(false)}
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

export default UpdateAccountForm;
