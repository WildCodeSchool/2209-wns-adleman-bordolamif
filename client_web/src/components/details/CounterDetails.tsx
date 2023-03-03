import CounterEditForm from '@components/forms/CounterEditForm';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      className="flex justify-between items-center bg-gray-200 rounded w-fit p-2 h-8 mx-2 mb-4"
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
      <div className="flex flex-raw ml-4">
        <button
          type="button"
          aria-label="edit"
          onClick={() => setIsEdit(true)}
        >
          <PencilSquareIcon className="w-4 mr-2 hover:text-blue-500" />
        </button>
        <button
          type="button"
          aria-label="delete"
          onClick={() => handleDeleteCounter(counter.id)}
        >
          <TrashIcon className="w-4 hover:text-red-600" />
        </button>
      </div>
      )}
            </>
          )
      }

    </div>
  );
}

export default CounterDetails;
