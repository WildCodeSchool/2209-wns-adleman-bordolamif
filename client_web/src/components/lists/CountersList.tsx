import { Counter } from '@utils/types/DataTypes';
import { CounterInput } from '@utils/types/InputTypes';
import CounterDetails from '../details/CounterDetails';

interface Props {
    countersList: Counter[],
    waitingRoomId: number,
    handleUpdateCounter: (data: CounterInput, id: number) => void
    handleDeleteCounter:(id: number) => void

}

function CountersList(props:Props) {
  const {
    countersList, waitingRoomId, handleUpdateCounter, handleDeleteCounter,
  } = props;

  return (
    <div className="grid grid-cols-2">
      {countersList && countersList! && countersList.map((counter) => (
        <CounterDetails
          key={counter.id}
          counter={counter}
          waitingRoomId={waitingRoomId}
          handleUpdateCounter={handleUpdateCounter}
          handleDeleteCounter={handleDeleteCounter}
        />
      ))}
    </div>
  );
}

export default CountersList;
