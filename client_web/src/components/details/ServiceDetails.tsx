import ServiceUpdateForm from '@components/forms/ServiceUpdateForm';
import WaitingRoomIcon from '@components/icons/WaitingRoomIcon';
import { ServiceData } from '@utils/types/DataTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import { useState } from 'react';

interface Props {
  handleUpdateService: (data: ServiceInput, id: number) => void
  handleDeleteService: (id: number) => void
    service: ServiceData
}

function ServiceDetails(props: Props) {
  const { service, handleDeleteService, handleUpdateService } = props;
  const [isUpdateService, setIsUpdateService] = useState<boolean>(false);
  return (
    <div className="bg-gray-200 p-4 my-2 rounded">
      <div className="flex bg-white justify-between px-2">
        <h2>{service.name}</h2>
        <WaitingRoomIcon waitingRoom={service.waitingRoom} />
        {!isUpdateService
        && (
        <div>
          <button
            type="button"
            onClick={() => setIsUpdateService(true)}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => handleDeleteService(service.id)}
          >
            Delete
          </button>
        </div>
        )}
      </div>
      {isUpdateService && (
      <ServiceUpdateForm
        serviceToUpdate={service}
        setIsUpdateService={setIsUpdateService}
        handleUpdateService={handleUpdateService}
      />
      )}
    </div>
  );
}

export default ServiceDetails;
