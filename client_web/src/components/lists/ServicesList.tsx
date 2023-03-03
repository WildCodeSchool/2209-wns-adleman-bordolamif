import { ServiceData } from '@utils/types/DataTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import ServiceDetails from '../details/ServiceDetails';

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
    <div className="grid grid-cols-3 gap-8">
      {servicesList && servicesList!
      && servicesList.map((service) => (
        mode === 'details' ? (
          <ServiceDetails
            handleUpdateService={handleUpdateService}
            handleDeleteService={handleDeleteService}
            key={service.id}
            service={service}
          />
        )
          : (
            <p key={service.id} />
          )
      ))}
    </div>
  );
}

export default ServicesList;
