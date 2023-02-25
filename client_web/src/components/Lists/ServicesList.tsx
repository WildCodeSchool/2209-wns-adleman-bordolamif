import { Service } from '@utils/types/DataTypes';
import ServiceDetails from '../Details/ServiceDetails';
import ServiceIcon from '../Icons/ServiceIcon';

interface Props {
    servicesList: Service[],
    mode: string
}

function ServicesList(props:Props) {
  const { servicesList, mode } = props;

  return (
    <div>
      {servicesList && servicesList!
      && servicesList.map((service) => (
        mode === 'details' ? (
          <ServiceDetails
            key={service.id}
            service={service}
          />
        )
          : (
            <ServiceIcon
              key={service.id}
              service={service}
            />
          )
      ))}

    </div>
  );
}

export default ServicesList;
