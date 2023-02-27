import { Service } from '@utils/types/DataTypes';

interface Props {
    service: Service
}

function ServiceDetails(props: Props) {
  const { service } = props;
  return (
    <div>
      <p>{service.name}</p>
    </div>
  );
}

export default ServiceDetails;
