import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { UserInput } from '@utils/types/InputTypes';
import { UserData } from '@utils/types/DataTypes';
import { UserFormDefaultValues } from '@utils/types/FormTypes';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';

import { ServiceId } from '@utils/types/InputIdTypes';
import ServicesCheckboxesList from './ServicesCheckboxesList';
import { useQuery } from '@apollo/client';

interface Props {
    userToUpdate: UserData | null;
    handleCreateUser: (data:UserInput) => void
    handleUpdateUser: (data:UserInput, id:number) => void
    handleCloseModal: () => void
}

const formNullValues = {
  firstname: null,
  lastname: null,
  email: null,
  services: [],
};

function UserForm(props : Props) {
  const {
    userToUpdate, handleCloseModal, handleCreateUser, handleUpdateUser,
  } = props;

  const { loading: servicesListLoading, data: servicesList } = useQuery(GET_ALL_SERVICES);

  const [error, setError] = useState('');
  const [userServices, setUserServices] = useState<ServiceId[]>([]);

  const { register, handleSubmit, reset } = useForm<UserFormDefaultValues>({
    defaultValues: userToUpdate || formNullValues,
  });

  const toggleUserServices = (idToSearch:number) => {
    if (userServices.find((service) => service.id === idToSearch)) {
      setUserServices(
        userServices.filter((serviceId) => serviceId.id !== idToSearch),
      );
    } else setUserServices([...userServices, { id: idToSearch }]);
  };

  useEffect(() => {
    if (userToUpdate !== null) {
      setUserServices(userToUpdate?.services.map((service) => (
        { id: service.id })) || []);
      reset(userToUpdate);
    } else {
      setUserServices([]);
      reset(formNullValues);
    }
  }, [userToUpdate, reset, handleCloseModal]);

  const onSubmit = async (data: UserFormDefaultValues) => {
    try {
      const userToSend:UserInput = {
        firstname: data.firstname!,
        lastname: data.lastname!,
        email: data.email!,
        role: userToUpdate?.role || 2,
        services: userServices,
      };
      if (userToUpdate) {
        await handleUpdateUser(userToSend, userToUpdate.id);
      } else await handleCreateUser(userToSend);
      // refetch
      handleCloseModal();
    } catch (submitError) {
      if (userToUpdate) setError('Error while trying to create user');
      else setError('Error while trying to edit user');
    }
  };

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';
  return (
    <div className="flex h-full justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <input placeholder="First Name" {...register('firstname')} required className={inputClassName} />
          <input placeholder="Last Name" {...register('lastname')} required className={inputClassName} />
          <input placeholder="email" {...register('email')} required className={inputClassName} />
          {servicesListLoading && <p>loading...</p>}
          <ServicesCheckboxesList
            checkList={userServices}
            servicesList={servicesList && servicesList.getAllServices}
            toggleCheckList={toggleUserServices}
          />
          <button
            type="submit"
            className="f-button-green"
          >
            Activer le compte
          </button>
          <div>
            {error && <div>{error}</div>}
          </div>
        </div>
      </form>
    </div>

  );
}

export default UserForm;
