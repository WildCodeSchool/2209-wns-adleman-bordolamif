import { Service } from '@utils/types/DataTypes';

interface Props {
    service: Service
}

function ServiceIcon(props: Props) {
  const { service } = props;
  return (
    <div
      className="f-acronyme"
      style={{ backgroundColor: `${service.color}` }}
    >
      {service.acronym}
    </div>
  );
}

export default ServiceIcon;
