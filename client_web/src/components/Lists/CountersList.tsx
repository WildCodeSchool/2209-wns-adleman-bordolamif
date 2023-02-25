import { Counter } from '@utils/types/DataTypes';
import CounterDetails from '../Details/CounterDetails';

interface Props {
    countersList: Counter[],
}

function CountersList(props:Props) {
  const { countersList } = props;

  return (
    <div>
      {countersList && countersList! && countersList.map((counter) => (
        <CounterDetails
          key={counter.id}
          counter={counter}

        />
      ))}
    </div>
  );
}

export default CountersList;
