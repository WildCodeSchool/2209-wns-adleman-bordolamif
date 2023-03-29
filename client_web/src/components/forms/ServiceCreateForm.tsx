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
    <form onSubmit={handleSubmit(onSubmit)} className="flex shadow-xl bg-gray-200 p-4 rounded-xl">
      <div>
        <label className="flex flex-col">
          Nom du service
          <input
            placeholder="Ex: Radiologie"
            {...register('name', { required: true })}
            className="f-input"
          />
        </label>
        <div className="flex flex-row justify-between">
          <label className="flex flex-col">
            Acronyme
            <input
              placeholder="Ex: RDL"
              className="f-input w-40"
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
        <div className="f-choice-button-format">
          <button
            className="f-button-red"
            type="button"
            onClick={() => setIsCreateService(false)}
          >
            Annuler
          </button>
          <button
            className="f-button-green"
            type="submit"
          >
            Créer
          </button>
        </div>
      </div>
    </form>
  );
}

export default ServiceCreateForm;
