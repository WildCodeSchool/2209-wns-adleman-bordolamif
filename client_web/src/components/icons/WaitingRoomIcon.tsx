import { WaitingRoom } from '@utils/types/DataTypes';

interface Props {
    waitingRoom: WaitingRoom
}

function WaitingRoomIcon(props: Props) {
  const { waitingRoom } = props;
  return (
    <div>
      <p>{waitingRoom?.name}</p>
    </div>
  );
}

export default WaitingRoomIcon;
