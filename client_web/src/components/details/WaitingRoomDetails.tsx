import CounterCreateForm from '@components/forms/CounterCreateForm';
import WaitingRoomUpdateForm from '@components/forms/WaitingRoomUpdateForm';
import { WaitingRoomData } from '@utils/types/DataTypes';
import { CounterInput, WaitingRoomInput } from '@utils/types/InputTypes';
import { useState } from 'react';
import CountersList from '../lists/CountersList';
import ServiceIcon from '@components/icons/ServiceIcon';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

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

  const closeModal = () => {
    setIsUpdateWaitingRoom(false);
  };

  return (
    <div className="f-between bg-gray-100 pb-3 px-3 rounded-xl my-1">
      <div
        className="f-services-card-decoration"
        style={{
          backgroundColor: '#9B9999',
        }}
      />
      <div className="flex flex-col mb-4">
        <div className="flex flex-row justify-between nunito-bold pl-2 pb-1 text-xl">
          <h2 className="mr-4">{waitingRoom.name}</h2>
          {!isUpdateWaitingRoom
          && (
          <div className="flex flex-row">
            <button
              type="button"
              onClick={() => setIsUpdateWaitingRoom(true)}
            >
              <PencilSquareIcon className="f-update-icon" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteWaitingRoom(waitingRoom.id)}
            >
              <TrashIcon className="f-delete-icon" />
            </button>
          </div>
          )}
        </div>
        <div className="flex flex-row p-2 gap-3">
          {waitingRoom.services.map((service) => (
            <ServiceIcon key={service.id} service={service} />
          ))}
        </div>
      </div>
      {isUpdateWaitingRoom && (
        <div>
          <WaitingRoomUpdateForm
            waitingRoomToUpdate={waitingRoom}
            setIsUpdateWaitingRoom={setIsUpdateWaitingRoom}
            handleUpdateWaitingRoom={handleUpdateWaitingRoom}
          />
          {/* eslint-disable-next-line */}
        <div className="cursor-default backdrop-blur-md absolute left-0 top-0 h-screen w-screen" onClick={closeModal} />
        </div>
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
            className="f-button-white-green"
            onClick={() => setIsCreateCounter(true)}
          >
            <PlusCircleIcon className="w-6 mr-2 hover:animate-pulse" />
            Guichet
          </button>
        )}
    </div>
  );
}

export default WaitingRoomDetails;
