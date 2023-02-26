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
    setWaitingRoomServices] = useState<ServiceId[]>(waitingRoomToUpdate.services);

  const { loading: servicesListLoading, data: servicesList } = useQuery(GET_ALL_SERVICES);

  const { register, handleSubmit } = useForm<WaitingRoomInput>({
    defaultValues: waitingRoomToUpdate,
  });

  const inputClassName = 'border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register('name')} required className={inputClassName} />
      {servicesListLoading && <p>Loading...</p>}
      <ServicesCheckboxesList
        checkList={waitingRoomServices}
        servicesList={servicesList && servicesList.getAllServices}
        toggleCheckList={toggleWaitingRoomServices}
      />
      <div className="flex flex-col">
        <button
          className="p-2 my-2 bg-red-600 rounded-xl w-2 h-2"
          type="button"
          aria-label="cancel"
          onClick={() => setIsUpdateWaitingRoom(false)}
        />
        <button
          className="p-2 my-2 bg-green-600 rounded-xl w-2 h-2"
          type="submit"
          aria-label="submit"
        />
      </div>
    </form>
  );
}

export default WaitingRoomUpdateForm;
