import { WaitingRoomData } from '@utils/types/DataTypes';
import { CounterInput, WaitingRoomInput } from '@utils/types/InputTypes';
import WaitingRoomDetails from '../details/WaitingRoomDetails';

interface Props {
    waitingRoomsList: WaitingRoomData[],
    handleUpdateCounter: (data: CounterInput, id: number) => void
    handleCreateCounter: (data: CounterInput) => void
    handleDeleteCounter: (id: number) => void
    handleUpdateWaitingRoom: (data: WaitingRoomInput, id:number) => void
    handleDeleteWaitingRoom: (id:number) => void
}

function WaitingRoomsList(props:Props) {
  const {
    waitingRoomsList,
    handleUpdateCounter,
    handleCreateCounter,
    handleDeleteCounter,
    handleUpdateWaitingRoom,
    handleDeleteWaitingRoom,
  } = props;

  return (
    <div className="grid grid-cols-2 gap-4">
      {waitingRoomsList && waitingRoomsList! && waitingRoomsList.map((waitingRoom) => ((
        <WaitingRoomDetails
          key={waitingRoom.id}
          waitingRoom={waitingRoom}
          handleUpdateCounter={handleUpdateCounter}
          handleCreateCounter={handleCreateCounter}
          handleDeleteCounter={handleDeleteCounter}
          handleUpdateWaitingRoom={handleUpdateWaitingRoom}
          handleDeleteWaitingRoom={handleDeleteWaitingRoom}
        />
      )))}
    </div>
  );
}

export default WaitingRoomsList;
