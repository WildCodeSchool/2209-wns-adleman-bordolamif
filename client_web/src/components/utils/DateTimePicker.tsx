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
    <div className="mt-4 flex flex-row gap-10 items-center justify-center">
      <p className="text-2xl">Statistiques du</p>
      <input
        className="f-input -mx-3 mt-2"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <p className="text-2xl">au</p>
      <input
        className="f-input -mx-3 mt-2"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button
        className="flex flex-row bg-green-600 nunito-bold text-white hover:bg-green-700 py-2 px-16 rounded-xl drop-shadow"
        type="button"
        onClick={validateDates}
      >
        Valider
      </button>

    </div>
  );
}

export default DateTimePicker;
