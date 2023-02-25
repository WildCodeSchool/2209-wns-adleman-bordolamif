import { useQuery } from '@apollo/client';
import WaitingRoomsList from '@components/lists/WaitingRoomsList';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';

function AdminWaitingRoomsAndCountersPage() {
  const {
    loading: waitingRoomsListLoading,
    data: waitingRoomsList,
  } = useQuery(GET_ALL_WAITINGROOMS);

  return (
    <div>
      <p>AdminWaitingRoomsAndCountersPage</p>
      {waitingRoomsListLoading && <p>loading...</p>}
      <WaitingRoomsList
        waitingRoomsList={waitingRoomsList && waitingRoomsList.getAllWaitingRooms}
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
