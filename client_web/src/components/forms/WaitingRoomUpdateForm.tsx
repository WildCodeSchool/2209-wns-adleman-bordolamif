import { useQuery } from '@apollo/client';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { WaitingRoomData } from '@utils/types/DataTypes';
import { ServiceId } from '@utils/types/InputIdTypes';
import { WaitingRoomInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ServicesCheckboxesList from './ServicesCheckboxesList';

interface Props {
    waitingRoomToUpdate: WaitingRoomData
    setIsUpdateWaitingRoom: (isEdit: boolean) => void
    handleUpdateWaitingRoom: (data: WaitingRoomInput, id: number) => void
}

function WaitingRoomUpdateForm(props: Props) {
  const { waitingRoomToUpdate, setIsUpdateWaitingRoom, handleUpdateWaitingRoom } = props;
  const [waitingRoomServices,
    setWaitingRoomServices] = useState<ServiceId[]>(waitingRoomToUpdate.services.map((service) => (
      { id: service.id })));

  const { loading: servicesListLoading, data: servicesList } = useQuery(GET_ALL_SERVICES);

  const { register, handleSubmit } = useForm<WaitingRoomInput>({
    defaultValues: waitingRoomToUpdate,
  });

  const toggleWaitingRoomServices = (idToSearch:number) => {
    if (waitingRoomServices.find((service) => service.id === idToSearch)) {
      setWaitingRoomServices(
        waitingRoomServices.filter((serviceId) => serviceId.id !== idToSearch),
      );
    } else setWaitingRoomServices([...waitingRoomServices, { id: idToSearch }]);
  };

  const onSubmit = async (data: WaitingRoomInput) => {
    const updatedWaitingRoom = {
      name: data.name,
      services: waitingRoomServices,
    };

    await handleUpdateWaitingRoom(updatedWaitingRoom, waitingRoomToUpdate.id);
    setIsUpdateWaitingRoom(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="absolute z-20 left-1/3 top-1/3 flex shadow-xl mx-10 bg-gray-200 p-8 rounded-xl">
      <div className="flex flex-col items-center">
        <label className="flex flex-col">
          Nom de la salle d'attente
          <input
            placeholder="Name"
            {...register('name')}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7"
          />
        </label>
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            {servicesListLoading && <p>Chargement...</p>}
            <ServicesCheckboxesList
              checkList={waitingRoomServices}
              servicesList={servicesList && servicesList.getAllServices}
              toggleCheckList={toggleWaitingRoomServices}
            />
          </div>
        </div>
        <div className="p-2 space-x-4">
          <button
            className="p-2 w-fit bg-red-600 rounded text-white h-fit hover:bg-red-700"
            type="button"
            onClick={() => setIsUpdateWaitingRoom(false)}
          >
            Annuler
          </button>
          <button
            className="p-2 w-fit bg-green-600 rounded text-white h-fit hover:bg-green-700"
            type="submit"
          >
            Appliquer
          </button>
        </div>
      </div>
    </form>
  );
}

export default WaitingRoomUpdateForm;
