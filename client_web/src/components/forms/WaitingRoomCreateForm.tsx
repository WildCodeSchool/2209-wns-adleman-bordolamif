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

  const inputClassName = 'border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none mb-7';
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-10">
      <input placeholder="Name" {...register('name')} required className={inputClassName} />
      {servicesListLoading && <p>Loading...</p>}
      <ServicesCheckboxesList
        checkList={waitingRoomServices}
        servicesList={servicesList && servicesList.getAllServices}
        toggleCheckList={toggleWaitingRoomServices}
      />
      <div className="flex">
        <button
          className="p-2 mx-2 bg-red-600 rounded text-white"
          type="button"
          onClick={() => setIsCreateWaitingRoom(false)}
        >Annuler
        </button>
        <button
          className="p-2 mx-2 bg-green-600 rounded text-white"
          type="submit"
        >
          Créer
        </button>
      </div>
    </form>
  );
}

export default WaitingRoomCreateForm;
