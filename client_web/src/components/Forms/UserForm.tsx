import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER, UPDATE_USER } from '@graphQL/mutations/userMutations';
import { useEffect, useState } from 'react';
import { UserInput } from 'src/utils/types/inputTypes';
import { UserData } from '@utils/types/DataTypes';
import { UserFormDefaultValues } from '@utils/types/FormTypes';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import ServicesCheckboxesList from './ServicesCheckboxesList';
import { ServiceId } from '@utils/types/InputIdTypes';

interface Props {
    userToUpdate: UserData | null;
    handleCloseModal: () => void
}

const formNullValues = {
  firstname: null,
  lastname: null,
  email: null,
  services: [],
};

function UserForm(props : Props) {
  const { userToUpdate, handleCloseModal } = props;

  const [CreateUser, { loading: creationLoading, error: creationError }] = useMutation(CREATE_USER);
  const [UpdateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER);
  const { loading: servicesListLoading, data: servicesList } = useQuery(GET_ALL_SERVICES);

  const [error, setError] = useState('');
  const [userServices, setUserServices] = useState<ServiceId[]>([]);

  const { register, handleSubmit, reset } = useForm<UserFormDefaultValues>({
    defaultValues: userToUpdate || formNullValues,
  });

  const toggleuserServices = (idToSearch:number) => {
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
        await UpdateUser({ variables: { data: userToSend, updateUserId: userToUpdate.id } });
      } else await CreateUser({ variables: { data: userToSend } });
      // refetch
      handleCloseModal();
    } catch (submitError) {
      setError('Error while trying to create user');
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
          <ServicesCheckboxesList
            checkList={userServices}
            servicesList={servicesList && servicesList.getAllServices}
            toggleCheckList={toggleuserServices}
          />
          <button type="submit" className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-3/6">Activer le compte</button>
          <div>
            {(creationLoading || updateLoading) && <div>Submitting ...</div>}
            {error && <div>{error}</div>}
          </div>
        </div>
      </form>
    </div>

  );
}

export default UserForm;
