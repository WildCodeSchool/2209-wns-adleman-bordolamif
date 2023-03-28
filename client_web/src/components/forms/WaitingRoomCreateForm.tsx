import { useQuery } from '@apollo/client';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { ServiceId } from '@utils/types/InputIdTypes';
import { WaitingRoomInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ServicesCheckboxesList from './ServicesCheckboxesList';

interface Props {
    setIsCreateWaitingRoom: (isEdit: boolean) => void
    handleCreateWaitingRoom: (data: WaitingRoomInput) => void
}

function WaitingRoomCreateForm(props: Props) {
  const { setIsCreateWaitingRoom, handleCreateWaitingRoom } = props;
  const [waitingRoomServices, setWaitingRoomServices] = useState<ServiceId[]>([]);

  const { loading: servicesListLoading, data: servicesList } = useQuery(GET_ALL_SERVICES);

  const { register, handleSubmit } = useForm<WaitingRoomInput>();

  const toggleWaitingRoomServices = (idToSearch:number) => {
    if (waitingRoomServices.find((service) => service.id === idToSearch)) {
      setWaitingRoomServices(
        waitingRoomServices.filter((serviceId) => serviceId.id !== idToSearch),
      );
    } else setWaitingRoomServices([...waitingRoomServices, { id: idToSearch }]);
  };

  const onSubmit = async (data: WaitingRoomInput) => {
    const waitingRoomToCreate = {
      name: data.name,
      services: waitingRoomServices,
    };
    await handleCreateWaitingRoom(waitingRoomToCreate);
    setIsCreateWaitingRoom(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex shadow-xl bg-gray-200 p-4 rounded-xl">
      <label className="flex flex-col mr-4">
        Nom de la salle d'attente
        <input
          placeholder="Ex: Salle d'attente 1"
          {...register('name')}
          required
          className="border rounded w-[15rem] py-2 px-4 text-gray-700 focus:outline-none mb-2"
        />
      </label>
      {servicesListLoading && <p>Loading...</p>}
      <ServicesCheckboxesList
        checkList={waitingRoomServices}
        servicesList={servicesList && servicesList.getAllServices}
        toggleCheckList={toggleWaitingRoomServices}
      />
      <div className="flex flex-row items-end justify-end">
        <button
          className="p-2 mx-2 w-[5rem] h-12 bg-red-600 rounded text-white hover:bg-red-700"
          type="button"
          onClick={() => setIsCreateWaitingRoom(false)}
        >
          Annuler
        </button>
        <button
          className="p-2 mx-2 w-[5rem] h-12 bg-green-600 rounded text-white hover:bg-green-700"
          type="submit"
        >
          Créer
        </button>
      </div>
    </form>
  );
}

export default WaitingRoomCreateForm;
