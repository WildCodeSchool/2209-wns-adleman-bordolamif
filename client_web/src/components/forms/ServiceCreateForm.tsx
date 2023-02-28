import { useQuery } from '@apollo/client';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { WaitingRoomId } from '@utils/types/InputIdTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { ColorResult } from 'react-color';
import { useForm } from 'react-hook-form';
import ColorPicker from './ColorPicker';

import WaitingRoomsRadioList from './WaitingRoomsRadioList';

interface Props {
    setIsCreateService: (isEdit: boolean) => void
    handleCreateService: (data: ServiceInput) => void
}

function ServiceCreateForm(props: Props) {
  const { setIsCreateService, handleCreateService } = props;

  const [serviceWaitingRoom, setServiceWaitingRoom] = useState<WaitingRoomId | undefined>();
  const [color, setColor] = useState<string>('#50d71e');


  const {
    loading: waitingRoomsListLoading,
    data: waitingRoomsList,
  } = useQuery(GET_ALL_WAITINGROOMS);

  const { register, handleSubmit } = useForm<ServiceInput>();

  const toggleServiceWaitingRoom = (id:number) => {
    setServiceWaitingRoom({ id });
  };

  const handleColorChange = (colorResult: ColorResult) => {
    setColor(colorResult.hex);
  };

  const onSubmit = async (data: ServiceInput) => {
    const serviceToCreate = {
      name: data.name,
      open: false,
      acronym: (data.acronym).toUpperCase(),
      color,
      waitingRoom: serviceWaitingRoom,
    };
    await handleCreateService(serviceToCreate);
    setIsCreateService(false);
  };

  const inputClassName = 'border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none mb-7';
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-10">
      <input placeholder="Nom" {...register('name', { required: true })} className={inputClassName} />
      {waitingRoomsListLoading && <p>Loading...</p>}
      <WaitingRoomsRadioList
        radioChecked={serviceWaitingRoom}
        waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
        toggleRadioList={toggleServiceWaitingRoom}
      />
      <input placeholder="Acronyme" className={inputClassName} {...register('acronym', { required: true, maxLength: 3 })} />

      <ColorPicker color={color} handleColorChange={handleColorChange} />

      <div className="flex">
        <button
          className="p-2 mx-2 bg-red-600 rounded text-white"
          type="button"
          onClick={() => setIsCreateService(false)}
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

export default ServiceCreateForm;
