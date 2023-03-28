import { useQuery } from '@apollo/client';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { ServiceData } from '@utils/types/DataTypes';
import { WaitingRoomId } from '@utils/types/InputIdTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import { ColorResult } from 'react-color';
import { useForm } from 'react-hook-form';
import ColorPicker from './ColorPicker';

import WaitingRoomsRadioList from './WaitingRoomsRadioList';

interface Props {
  serviceToUpdate: ServiceData
  setIsUpdateService: (isEdit: boolean) => void
  handleUpdateService: (data: ServiceInput, id: number) => void
}

function ServiceUpdateForm(props: Props) {
  const { serviceToUpdate, setIsUpdateService, handleUpdateService } = props;
  const [serviceWaitingRoom,
    setServiceWaitingRoom] = useState<WaitingRoomId>({
      id: serviceToUpdate.waitingRoom?.id,
    } || null);
  const [color, setColor] = useState<string>(serviceToUpdate.color);

  const {
    loading: waitingRoomsListLoading,
    data: waitingRoomsList,
  } = useQuery(GET_ALL_WAITINGROOMS);

  const { register, handleSubmit } = useForm<ServiceInput>({
    defaultValues: serviceToUpdate,
  });

  const handleColorChange = (colorResult: ColorResult) => {
    setColor(colorResult.hex);
  };

  const toggleServiceWaitingRoom = (id:number) => {
    setServiceWaitingRoom({ id });
  };

  const onSubmit = async (data: ServiceInput) => {
    const updatedService: ServiceInput = {
      name: data.name,
      isOpen: false,
      acronym: (data.acronym).toUpperCase(),
      color,
      waitingRoom: serviceWaitingRoom,
    };
    if (serviceWaitingRoom.id === undefined) updatedService.waitingRoom = null;

    await handleUpdateService(updatedService, serviceToUpdate.id);
    setIsUpdateService(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="absolute z-20 left-1/3 top-1/3 flex shadow-xl mx-10 bg-gray-200 p-4 rounded-xl">
      <div>
        <label className="flex flex-col">
          Nom du service
          <input
            placeholder="Ex: Radiologie"
            {...register('name', { required: true })}
            className="border rounded w-[15rem] py-2 px-4 text-gray-700 focus:outline-none mb-2"
          />
        </label>
        <div className="flex flex-row justify-between">
          <label className="flex flex-col">
            Acronyme
            <input
              placeholder="Ex: RDL"
              className="border rounded w-[10rem] mb-1 px-4 py-2 text-gray-700 focus:outline-none"
              {...register('acronym', { required: true, maxLength: 3 })}
            />
          </label>
          <div>
            <p>
              Couleur
            </p>
            <ColorPicker
              color={color}
              handleColorChange={handleColorChange}
            />
          </div>
        </div>
      </div>
      <div className="ml-6">
        <div className="mb-10">
          <p className="mb-2">
            Salle d'attente
          </p>
          {waitingRoomsListLoading && <p>Chargement...</p>}
          <WaitingRoomsRadioList
            radioChecked={serviceWaitingRoom}
            waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
            toggleRadioList={toggleServiceWaitingRoom}
          />
        </div>
        <div className="flex flex-row justify-end">
          <button
            className="p-2 mx-2 w-[5rem] bg-red-600 rounded text-white hover:bg-red-700"
            type="button"
            onClick={() => setIsUpdateService(false)}
          >
            Annuler
          </button>
          <button
            className="p-2 mx-2 w-fit bg-green-600 rounded text-white hover:bg-green-700"
            type="submit"
          >
            Appliquer
          </button>
        </div>
      </div>
    </form>
  );
}

export default ServiceUpdateForm;
