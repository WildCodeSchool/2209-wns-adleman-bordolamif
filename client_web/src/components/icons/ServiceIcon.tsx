import { Service } from '@utils/types/DataTypes';

interface Props {
    service: Service
}

function ServiceIcon(props: Props) {
  const { service } = props;
  return (
    <div>
      <p>{service.acronym}</p>
    </div>
  );
}

export default ServiceIcon;
