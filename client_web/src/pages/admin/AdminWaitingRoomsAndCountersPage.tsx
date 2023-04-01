import { useMutation, useQuery } from '@apollo/client';
import WaitingRoomCreateForm from '@components/forms/WaitingRoomCreateForm';
import WaitingRoomsList from '@components/lists/WaitingRoomsList';
import { CREATE_COUNTER, DELETE_COUNTER, UPDATE_COUNTER } from '@graphQL/mutations/counterMutations';
import { CREATE_WAITINGROOM, DELETE_WAITINGROOM, UPDATE_WAITINGROOM } from '@graphQL/mutations/waitingRoomMutations';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CounterInput, WaitingRoomInput } from '@utils/types/InputTypes';
import { useState } from 'react';

function AdminWaitingRoomsAndCountersPage() {
  const {
    loading: waitingRoomsListLoading,
    data: waitingRoomsList,
    refetch: refetchWaitingRoomsList,
  } = useQuery(GET_ALL_WAITINGROOMS);

  const [UpdateCounter] = useMutation(UPDATE_COUNTER);
  const [CreateCounter] = useMutation(CREATE_COUNTER);
  const [DeleteCounter] = useMutation(DELETE_COUNTER);

  const [UpdateWaitingRoom] = useMutation(UPDATE_WAITINGROOM);
  const [CreateWaitingRoom] = useMutation(CREATE_WAITINGROOM);
  const [DeleteWaitingRoom] = useMutation(DELETE_WAITINGROOM);

  const [isCreateWaitingRoom, setIsCreateWaitingRoom] = useState<boolean>(false);

  const handleUpdateCounter = async (valuesToUpdate:CounterInput, updateCounterId: number) => {
    await UpdateCounter({ variables: { data: valuesToUpdate, updateCounterId } });
    refetchWaitingRoomsList();
  };

  const handleCreateCounter = async (data:CounterInput) => {
    await CreateCounter({ variables: { data } });
    refetchWaitingRoomsList();
  };

  const handleDeleteCounter = async (id: number) => {
    await DeleteCounter({ variables: { deleteCounterId: id } });
    refetchWaitingRoomsList();
  };

  const handleUpdateWaitingRoom = async (
    valuesToUpdate:WaitingRoomInput,
    updateWaitingRoomId: number,
  ) => {
    await UpdateWaitingRoom({ variables: { data: valuesToUpdate, updateWaitingRoomId } });
    refetchWaitingRoomsList();
  };

  const handleCreateWaitingRoom = async (data:WaitingRoomInput) => {
    await CreateWaitingRoom({ variables: { data } });
    refetchWaitingRoomsList();
  };

  const handleDeleteWaitingRoom = async (id: number) => {
    await DeleteWaitingRoom({ variables: { deleteWaitingRoomId: id } });
    refetchWaitingRoomsList();
  };

  return (
    <>
      <div className="f-title-format">
        <h1 className="f-main-title">Gérer les salles d'attente et les guichets</h1>
        <div className="f-decoration-line" />
      </div>
      <p className="pl-6 text-lg">
        Vous pouvez ici ajouter, modifier ou supprimer
        les différentes salles d'attente et gérer leurs guichets associés.
      </p>
      <div className="f-format-creation">
        <div className="f-format-adding">
          <h2 className="f-button-text-white">Créer une salle d'attente</h2>
          <div className="flex flex-row ml-8 mb-4 mx-4">
            <div className="flex flex-col items-center">
              {!isCreateWaitingRoom
        && (
          <button
            type="button"
            className="f-button-orange"
            onClick={() => setIsCreateWaitingRoom(true)}
          >
            <PlusCircleIcon className="mr-2 w-7" />
            Nouvelle salle d'attente
          </button>
        )}
            </div>
          </div>
          {isCreateWaitingRoom
      && (
        <WaitingRoomCreateForm
          setIsCreateWaitingRoom={setIsCreateWaitingRoom}
          handleCreateWaitingRoom={handleCreateWaitingRoom}
        />
      )}
        </div>
      </div>
      <h2 className="text-2xl ml-6 mb-8">Salles d'attente et leur guichets</h2>
      <div className="px-8 mx-">
        <WaitingRoomsList
          waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
          handleUpdateCounter={handleUpdateCounter}
          handleCreateCounter={handleCreateCounter}
          handleDeleteCounter={handleDeleteCounter}
          handleUpdateWaitingRoom={handleUpdateWaitingRoom}
          handleDeleteWaitingRoom={handleDeleteWaitingRoom}
        />
        {waitingRoomsListLoading && <p>loading...</p>}
      </div>
    </>
  );
}
export default AdminWaitingRoomsAndCountersPage;
