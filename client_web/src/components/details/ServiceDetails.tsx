import ServiceUpdateForm from '@components/forms/ServiceUpdateForm';
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
    <div className="flex flex-col border-2 border-gray-200 py-2 rounded-xl">
      <div className="nunito-bold pl-2 pb-1 text-lg">
        <h2>{service.name}</h2>
      </div>
      <div className="flex flex-raw items-center bg-white justify-between px-2">
        <div
          className="w-14 h-8 rounded-xl pt-1 text-center text-white nunito-bold"
          style={{ backgroundColor: `${service.color}` }}
        >
          {service.acronym}
        </div>
        <p>{service.waitingRoom?.name}</p>
        {!isUpdateService
        && (
        <div>
          <button
            type="button"
            onClick={() => setIsUpdateService(true)}
          >
            <PencilSquareIcon className="w-6 mr-2 hover:text-blue-500" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteService(service.id)}
          >
            <TrashIcon className="w-6 hover:text-red-600" />
          </button>
        </div>
        )}
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
