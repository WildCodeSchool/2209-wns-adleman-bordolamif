import ServiceUpdateForm from '@components/forms/ServiceUpdateForm';
import ServiceIcon from '@components/icons/ServiceIcon';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
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

  const closeModal = () => {
    setIsUpdateService(false);
  };

  return (
    <div className="flex flex-col bg-gray-100 pb-2 rounded-xl">
      <div
        className="f-services-card-decoration"
        style={{ backgroundColor: `${service.color}` }}
      />
      <div className="flex flex-row justify-between mb-2">
        <div className="nunito-bold pl-3 pb-1 text-lg">
          <h2>{service.name}</h2>
        </div>
        {!isUpdateService
        && (
        <div>
          <button
            type="button"
            onClick={() => setIsUpdateService(true)}
          >
            <PencilSquareIcon className="f-update-icon" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteService(service.id)}
          >
            <TrashIcon className="f-delete-icon" />
          </button>
        </div>
        )}
      </div>
      <div className="flex items-center justify-between px-2">
        <ServiceIcon service={service} />
        <p className="ml-2">{service.waitingRoom?.name}</p>
      </div>
      {isUpdateService && (
        <div>
          <ServiceUpdateForm
            serviceToUpdate={service}
            setIsUpdateService={setIsUpdateService}
            handleUpdateService={handleUpdateService}
          />
          {/* eslint-disable-next-line */}
          <div className="cursor-default backdrop-blur-md absolute left-0 top-0 h-screen w-screen" onClick={closeModal} />
        </div>
      )}
    </div>
  );
}

export default ServiceDetails;
