import { WaitingRoomData } from '@utils/types/DataTypes';
import CountersList from '../lists/CountersList';
import ServicesList from '../lists/ServicesList';

interface Props {
    waitingRoom: WaitingRoomData
}

function WaitingRoomDetails(props: Props) {
  const { waitingRoom } = props;
  return (
    <div>
      <p>{waitingRoom.name}</p>
      <ServicesList servicesList={waitingRoom.services} mode="icons" />
      <CountersList countersList={waitingRoom.counters} />
      <button
        type="button"
        className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-20"
      >
        Add Counter
      </button>
    </div>
  );
}

export default WaitingRoomDetails;
