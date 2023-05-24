import { StartEndDate } from '@utils/types/InputTypes';
import { useState } from 'react';

interface Props {
  validateDateInterval: (dateInterval: StartEndDate)=> void

}

function DateTimePicker(props:Props) {
  const { validateDateInterval } = props;
  const today = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);

    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(today());

  const validateDates = () => {
    validateDateInterval({
      startDate,
      endDate,
    });
  };

  return (
    <>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button type="button" onClick={validateDates}>Valider</button>

    </>
  );
}

export default DateTimePicker;
