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
    <form onSubmit={handleSubmit(onSubmit)} className="f-format-create-box flex-col">
      <label className="f-label-name-white">
        Nom de la salle d'attente
        <input
          placeholder="Ex: Salle d'attente 1"
          {...register('name')}
          required
          className="f-input"
        />
      </label>
      {servicesListLoading && <p>Loading...</p>}
      <ServicesCheckboxesList
        checkList={waitingRoomServices}
        servicesList={servicesList && servicesList.getAllServices}
        toggleCheckList={toggleWaitingRoomServices}
      />
      <div className="f-choice-button-format items-end mt-2">
        <button
          className="f-button-white-red"
          type="button"
          onClick={() => setIsCreateWaitingRoom(false)}
        >
          Annuler
        </button>
        <button
          className="f-button-white-green"
          type="submit"
        >
          Créer
        </button>
      </div>
    </form>
  );
}

export default WaitingRoomCreateForm;
