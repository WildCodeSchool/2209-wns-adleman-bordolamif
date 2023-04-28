import { useMutation, useQuery } from '@apollo/client';
import ServicesRadioList from '@components/forms/ServicesRadioList';
import { UPDATE_USER } from '@graphQL/mutations/userMutations';
import { GET_ONE_WAITINGROOM } from '@graphQL/query/waitingRoomQuery';
import { useUserProfile } from '@layouts/StaffLayout';
import {
  CounterData, Service, ServiceData,
} from '@utils/types/DataTypes';
import { UserInput } from '@utils/types/InputTypes';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

function OperatorStartUpPage() {
  const { userProfile } = useUserProfile();
  const [selectedService, setSelectedService] = useState<ServiceData | undefined>();

  const { data: waiTingRoomData, refetch } = useQuery(
    GET_ONE_WAITINGROOM,
    {
      variables: {
        getOneWaitingRoomId: selectedService?.waitingRoom?.id,
        skip: selectedService,
      },
    },
  );
  const [UpdateUser, {
    data: userUpdateData,
    loading: userUpdateloading,
    error: userUpdateError,
  }] = useMutation(UPDATE_USER);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedService) {
      refetch({
        getOneWaitingRoomId: selectedService.waitingRoom.id,
      });
    }
  }, [selectedService, refetch]);

  const toggleSelectedService = (service:ServiceData) => {
    setSelectedService(service);
    refetch();
  };

  const { register, handleSubmit } = useForm<{id: string}>();

  const onSubmit = async (counterId: {id: string}) => {
    const parsedCounterId = parseInt(counterId.id, 10);
    const {
      id, firstname, lastname, email, role, services,
    } = userProfile!;
    const userToSend: UserInput = {
      firstname,
      lastname,
      email,
      role,
      services: services.map((sv: Service) => ({ id: sv.id })),
      counter: { id: parsedCounterId },
      currentService: { id: selectedService!.id },
    };

    await UpdateUser({ variables: { data: userToSend, updateUserId: id } });
  };

  if (userUpdateData! && !userUpdateError) navigate('/operator/dashboard');

  return (
    <div>
      <h2>Sélectionnez votre service</h2>

      <ServicesRadioList
        radioChecked={selectedService}
        servicesList={userProfile!.services}
        toggleRadioList={toggleSelectedService}
      />
      <h3>Sélectionnez votre guichet</h3>

      { waiTingRoomData && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start">
          <select
            {...register('id')}
            defaultValue=""
          >
            <option value="">Mon guichet</option>
            {waiTingRoomData.getOneWaitingRoom.counters.map((counter:CounterData) => (
              <option
                key={counter.id}
                value={counter.id}
                disabled={counter.user! && true}
              >{counter.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="f-button-green"
          >
            C'est parti !
          </button>
        </div>
      </form>
      )}
      {userUpdateloading && <p>Prêt ?</p>}
      {userUpdateError && <p>Une erreur est survenue</p>}

    </div>
  );
}
export default OperatorStartUpPage;
