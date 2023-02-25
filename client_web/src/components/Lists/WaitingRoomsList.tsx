import { WaitingRoomData } from '@utils/types/DataTypes';
import { CounterInput } from '@utils/types/InputTypes';
import WaitingRoomDetails from '../details/WaitingRoomDetails';

interface Props {
    waitingRoomsList: WaitingRoomData[],
    handleUpdateCounter: (data: CounterInput, id: number) => void
    handleCreateCounter: (data: CounterInput) => void
    handleDeleteCounter: (id: number) => void
}

function WaitingRoomsList(props:Props) {
  const {
    waitingRoomsList, handleUpdateCounter, handleCreateCounter, handleDeleteCounter,
  } = props;

  return (
    <div>
      {waitingRoomsList && waitingRoomsList! && waitingRoomsList.map((waitingRoom) => (
        <WaitingRoomDetails
          key={waitingRoom.id}
          waitingRoom={waitingRoom}
          handleUpdateCounter={handleUpdateCounter}
          handleCreateCounter={handleCreateCounter}
          handleDeleteCounter={handleDeleteCounter}
        />
      ))}
    </div>
  );
}

export default WaitingRoomsList;
