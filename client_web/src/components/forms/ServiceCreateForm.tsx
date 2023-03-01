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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="shadow-xl mx-10 bg-gray-200 p-6 w-fit rounded-xl mb-8 mx-auto mt-4">
      <label className="flex flex-col">
        Nom du service
        <input
          placeholder="Radiologie"
          {...register('name', { required: true })}
          className="border rounded w-[15rem] py-2 px-4 text-gray-700 focus:outline-none mb-4"
        />
      </label>
      <p className="mb-2">
        Salle d'attente
        {waitingRoomsListLoading && <p>Chargement...</p>}
        <WaitingRoomsRadioList
          radioChecked={serviceWaitingRoom}
          waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
          toggleRadioList={toggleServiceWaitingRoom}
        />
      </p>
      <div className="mb-1 flex flex-raw justify-between">
        <p>Acronyme <span className="text-xs">(3 lettres)</span></p>
        <p>Couleur</p>
      </div>
      <div className="flex flex-raw justify-between items-center mb-4">
        <input
          placeholder="RDL"
          className="border rounded w-[10rem] mb-1 px-4 py-2 text-gray-700 focus:outline-none"
          {...register('acronym', { required: true, maxLength: 3 })}
        />
        <ColorPicker
          color={color}
          handleColorChange={handleColorChange}
        />
      </div>
      <div className="flex flex-raw justify-start">
        <button
          className="p-2 mx-2 bg-red-600 rounded text-white hover:bg-red-700"
          type="button"
          onClick={() => setIsCreateService(false)}
        >
          Annuler
        </button>
        <button
          className="p-2 mx-2 bg-green-600 rounded text-white hover:bg-green-700"
          type="submit"
        >
          Créer
        </button>
      </div>
    </form>
  );
}

export default ServiceCreateForm;
