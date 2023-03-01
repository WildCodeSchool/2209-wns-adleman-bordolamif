import { ServiceData } from '@utils/types/DataTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import ServiceDetails from '../details/ServiceDetails';
import ServiceIcon from '../icons/ServiceIcon';

interface Props {
    servicesList: ServiceData[],
    handleUpdateService: (data: ServiceInput, id: number) => void
    handleDeleteService: (id: number) => void
    mode: string
  }

function ServicesList(props:Props) {
  const {
    servicesList, handleUpdateService, handleDeleteService, mode,
  } = props;

  return (
    <div>
      {servicesList && servicesList!
      && (
        (mode === 'details' && servicesList.map((service) => (
          <ServiceDetails
            handleUpdateService={handleUpdateService}
            handleDeleteService={handleDeleteService}
            key={service.id}
            service={service}
          />
        )))
        || (mode === 'icons' && servicesList.map((service) => (
          <ServiceIcon
            key={service.id}
            service={service}
          />
        )))
      )}
    </div>
  );
}

export default ServicesList;
