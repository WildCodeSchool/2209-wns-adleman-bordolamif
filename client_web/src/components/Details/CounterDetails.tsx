import CounterEditForm from '@components/forms/CounterEditForm';
import { Counter } from '@utils/types/DataTypes';
import { CounterInput } from '@utils/types/InputTypes';
import { useState } from 'react';

interface Props {
    counter: Counter
    waitingRoomId: number
    handleUpdateCounter: (data: CounterInput, id: number) => void
    handleDeleteCounter: (id: number) => void

}

function CounterDetails(props: Props) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {
    counter, waitingRoomId, handleUpdateCounter, handleDeleteCounter,
  } = props;

  return (
    <div
      className="flex justify-between items-center bg-white rounded w-1/6 m-4 h-16 px-2"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {
        isEdit
          ? (
            <CounterEditForm
              counter={counter}
              waitingRoomId={waitingRoomId}
              setIsEdit={setIsEdit}
              handleUpdateCounter={handleUpdateCounter}
            />
          )
          : (
            <>
              <p>{counter.name}</p>
              {isHover
      && (
      <div className="flex flex-col">
        <button
          className="p-2 my-2 bg-sky-600 rounded-xl w-2 h-2"
          type="button"
          aria-label="edit"
          onClick={() => setIsEdit(true)}
        />
        <button
          className="p-2 my-2 bg-red-600 rounded-xl w-2 h-2"
          type="button"
          aria-label="delete"
          onClick={() => handleDeleteCounter(counter.id)}
        />
      </div>
      )}
            </>
          )
      }

    </div>
  );
}

export default CounterDetails;
