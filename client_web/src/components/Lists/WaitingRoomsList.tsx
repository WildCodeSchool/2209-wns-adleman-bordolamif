import { WaitingRoomData } from '@utils/types/DataTypes';
import WaitingRoomDetails from '../details/WaitingRoomDetails';

interface Props {
    waitingRoomsList: WaitingRoomData[],
}

function WaitingRoomsList(props:Props) {
  const { waitingRoomsList } = props;

  return (
    <div>
      {waitingRoomsList && waitingRoomsList! && waitingRoomsList.map((waitingRoom) => (
        <WaitingRoomDetails
          key={waitingRoom.id}
          waitingRoom={waitingRoom}
        />
      ))}
    </div>
  );
}

export default WaitingRoomsList;
