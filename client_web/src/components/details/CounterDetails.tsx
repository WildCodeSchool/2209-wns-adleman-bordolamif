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
      className="flex justify-between items-center bg-white border-2 border-gray-400 rounded-xl w-fit px-2 py-1 h-fit mx-2 mb-4"
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
      <div className="flex flex-row ml-4">
        <button
          type="button"
          aria-label="edit"
          onClick={() => setIsEdit(true)}
        >
          <PencilSquareIcon className="f-update-icon" />
        </button>
        <button
          type="button"
          aria-label="delete"
          onClick={() => handleDeleteCounter(counter.id)}
        >
          <TrashIcon className="f-delete-icon mr-1" />
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
