import CounterCreateForm from '@components/forms/CounterCreateForm';
import WaitingRoomUpdateForm from '@components/forms/WaitingRoomUpdateForm';
import { WaitingRoomData } from '@utils/types/DataTypes';
import { CounterInput, WaitingRoomInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import CountersList from '../lists/CountersList';
import ServicesList from '../lists/ServicesList';

interface Props {
    waitingRoom: WaitingRoomData,
    handleUpdateCounter: (data: CounterInput, id: number) => void
    handleCreateCounter: (data: CounterInput) => void
    handleDeleteCounter: (id: number) => void
    handleUpdateWaitingRoom: (data: WaitingRoomInput, id: number) => void
    handleDeleteWaitingRoom: (id: number) => void
}

function WaitingRoomDetails(props: Props) {
  const {
    waitingRoom,
    handleUpdateCounter,
    handleCreateCounter,
    handleDeleteCounter,
    handleUpdateWaitingRoom,
    handleDeleteWaitingRoom,
  } = props;
  const [isCreateCounter, setIsCreateCounter] = useState<boolean>(false);
  const [isUpdateWaitingRoom, setIsUpdateWaitingRoom] = useState<boolean>(false);
  return (
    <div className="bg-gray-200 p-4 my-2 rounded">
      <div className="flex bg-white justify-between px-2">
        <h2>{waitingRoom.name}</h2>
        <ServicesList servicesList={waitingRoom.services} mode="icons" />
        {!isUpdateWaitingRoom
        && (
        <div>
          <button
            type="button"
            onClick={() => setIsUpdateWaitingRoom(true)}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => handleDeleteWaitingRoom(waitingRoom.id)}
          >
            Delete
          </button>
        </div>
        )}
      </div>
      {isUpdateWaitingRoom && (
      <WaitingRoomUpdateForm
        waitingRoomToUpdate={waitingRoom}
        setIsUpdateWaitingRoom={setIsUpdateWaitingRoom}
        handleUpdateWaitingRoom={handleUpdateWaitingRoom}
      />
      )}
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
