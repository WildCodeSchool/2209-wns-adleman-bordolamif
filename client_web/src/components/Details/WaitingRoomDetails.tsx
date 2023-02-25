import CounterCreateForm from '@components/forms/CounterCreateForm';
import { WaitingRoomData } from '@utils/types/DataTypes';
import { CounterInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import CountersList from '../lists/CountersList';
import ServicesList from '../lists/ServicesList';

interface Props {
    waitingRoom: WaitingRoomData,
    handleUpdateCounter: (data: CounterInput, id: number) => void
    handleCreateCounter: (data: CounterInput) => void
    handleDeleteCounter: (id: number) => void
}

function WaitingRoomDetails(props: Props) {
  const {
    waitingRoom, handleUpdateCounter, handleCreateCounter, handleDeleteCounter,
  } = props;
  const [isCreateCounter, setIsCreateCounter] = useState<boolean>(false);
  return (
    <div className="bg-gray-200 p-4 rounded">
      <div className="flex bg-white justify-between px-2">
        <h2>{waitingRoom.name}</h2>
        <ServicesList servicesList={waitingRoom.services} mode="icons" />
      </div>
      <CountersList
        countersList={waitingRoom.counters}
        waitingRoomId={waitingRoom.id}
        handleUpdateCounter={handleUpdateCounter}
        handleDeleteCounter={handleDeleteCounter}
      />
      {isCreateCounter
        ? (
          <CounterCreateForm
            waitingRoomId={waitingRoom.id}
            setIsCreateCounter={setIsCreateCounter}
            handleCreateCounter={handleCreateCounter}
          />
        )
        : (
          <button
            type="button"
            className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-20"
            onClick={() => setIsCreateCounter(true)}
          >
            Add Counter
          </button>
        )}

    </div>
  );
}

export default WaitingRoomDetails;
