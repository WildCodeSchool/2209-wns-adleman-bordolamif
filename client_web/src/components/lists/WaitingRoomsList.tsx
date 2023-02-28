import WaitingRoomIcon from '@components/icons/WaitingRoomIcon';
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
    mode :string
}

function WaitingRoomsList(props:Props) {
  const {
    waitingRoomsList,
    handleUpdateCounter,
    handleCreateCounter,
    handleDeleteCounter,
    handleUpdateWaitingRoom,
    handleDeleteWaitingRoom,
    mode,
  } = props;

  return (
    <div>
      {waitingRoomsList && waitingRoomsList! && waitingRoomsList.map((waitingRoom) => (mode === 'details'
        ? (
          <WaitingRoomDetails
            key={waitingRoom.id}
            waitingRoom={waitingRoom}
            handleUpdateCounter={handleUpdateCounter}
            handleCreateCounter={handleCreateCounter}
            handleDeleteCounter={handleDeleteCounter}
            handleUpdateWaitingRoom={handleUpdateWaitingRoom}
            handleDeleteWaitingRoom={handleDeleteWaitingRoom}
          />
        )
        : (<WaitingRoomIcon waitingRoom={waitingRoom} key={waitingRoom.id} />)
      ))}
    </div>
  );
}

export default WaitingRoomsList;
