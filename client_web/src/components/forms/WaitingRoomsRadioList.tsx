import { WaitingRoom } from '@utils/types/DataTypes';
import { WaitingRoomId } from '@utils/types/InputIdTypes';

interface Props {
radioChecked : WaitingRoomId | undefined,
waitingRoomsList : WaitingRoom[] | null
toggleRadioList: (id: number) => void;
}

function WaitingRoomsRadioList(props: Props) {
  const { radioChecked, waitingRoomsList, toggleRadioList } = props;
  return (
    <div>
      {waitingRoomsList && waitingRoomsList.map((waitingRoom: WaitingRoom) => (
        <label key={waitingRoom.id} className="p-1">
          <input
            type="radio"
            value={waitingRoom.id}
            name={waitingRoom.name}
            checked={radioChecked?.id === waitingRoom.id}
            onChange={() => toggleRadioList(waitingRoom.id)}
          />
          {waitingRoom.name}
        </label>
      ))}
    </div>

  );
}

export default WaitingRoomsRadioList;
