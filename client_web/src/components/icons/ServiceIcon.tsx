import { Service } from '@utils/types/DataTypes';

interface Props {
    service: Service
}

function ServiceIcon(props: Props) {
  const { service } = props;
  return (
    <div
      className="w-14 h-8 rounded-xl pt-1 text-center text-white nunito-bold"
      style={{ backgroundColor: `${service.color}` }}
    >
      {service.acronym}
    </div>
  );
}

export default ServiceIcon;
