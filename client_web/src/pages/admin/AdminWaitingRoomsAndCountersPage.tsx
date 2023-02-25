import { useMutation, useQuery } from '@apollo/client';
import WaitingRoomsList from '@components/lists/WaitingRoomsList';
import { CREATE_COUNTER, DELETE_COUNTER, UPDATE_COUNTER } from '@graphQL/mutations/counterMutations';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { CounterInput } from '@utils/types/InputTypes';

function AdminWaitingRoomsAndCountersPage() {
  const {
    loading: waitingRoomsListLoading,
    data: waitingRoomsList,
    refetch: refetchWaitingRoomsList,
  } = useQuery(GET_ALL_WAITINGROOMS);

  const [UpdateCounter] = useMutation(UPDATE_COUNTER);
  const [CreateCounter] = useMutation(CREATE_COUNTER);
  const [DeleteCounter] = useMutation(DELETE_COUNTER);

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

  return (
    <div>
      <p>AdminWaitingRoomsAndCountersPage</p>
      {waitingRoomsListLoading && <p>loading...</p>}
      <WaitingRoomsList
        waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
        handleUpdateCounter={handleUpdateCounter}
        handleCreateCounter={handleCreateCounter}
        handleDeleteCounter={handleDeleteCounter}
      />
      <button
        type="button"
        className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-3/6"
      >
        Create WR
      </button>
    </div>

  );
}
export default AdminWaitingRoomsAndCountersPage;
