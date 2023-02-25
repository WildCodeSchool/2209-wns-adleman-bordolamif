import { Counter } from '@utils/types/DataTypes';

interface Props {
    counter: Counter
}

function CounterDetails(props: Props) {
  const { counter } = props;
  return (
    <p>{counter.name}</p>
  );
}

export default CounterDetails;
