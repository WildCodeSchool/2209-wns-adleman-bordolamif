import { useMutation, useQuery } from '@apollo/client';
import WaitingRoomCreateForm from '@components/forms/WaitingRoomCreateForm';
import WaitingRoomsList from '@components/lists/WaitingRoomsList';
import { CREATE_COUNTER, DELETE_COUNTER, UPDATE_COUNTER } from '@graphQL/mutations/counterMutations';
import { CREATE_WAITINGROOM, DELETE_WAITINGROOM, UPDATE_WAITINGROOM } from '@graphQL/mutations/waitingRoomMutations';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
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
    <div>
      <div className="flex justify-between">
        <p>AdminWaitingRoomsAndCountersPage</p>
        {!isCreateWaitingRoom
        && (
          <button
            type="button"
            className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-1/6"
            onClick={() => setIsCreateWaitingRoom(true)}
          >
            Create WR
          </button>
        )}
      </div>
      {isCreateWaitingRoom
      && (
      <WaitingRoomCreateForm
        setIsCreateWaitingRoom={setIsCreateWaitingRoom}
        handleCreateWaitingRoom={handleCreateWaitingRoom}
      />
      )}
      {waitingRoomsListLoading && <p>loading...</p>}
      <WaitingRoomsList
        waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
        handleUpdateCounter={handleUpdateCounter}
        handleCreateCounter={handleCreateCounter}
        handleDeleteCounter={handleDeleteCounter}
        handleUpdateWaitingRoom={handleUpdateWaitingRoom}
        handleDeleteWaitingRoom={handleDeleteWaitingRoom}
      />
    </div>

  );
}
export default AdminWaitingRoomsAndCountersPage;
