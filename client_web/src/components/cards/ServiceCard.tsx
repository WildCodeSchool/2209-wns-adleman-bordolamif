import { StatusEnum } from '@utils/enum/StatusEnum';
import { ServiceData } from '@utils/types/DataTypes';

interface Props {
    service: ServiceData
    handleOpenModal: (service: ServiceData) => void
}

function ServiceCard(props: Props) {
  const { service, handleOpenModal } = props;

  return (
    <button type="button" style={{ backgroundColor: `${service.color}` }} className="m-1 p-1 rounded" onClick={() => handleOpenModal(service)}>
      <p>{service.name}</p>
      <p>Tickets en attente :
        {service.tickets.filter((ticket) => ticket.status === StatusEnum.EN_ATTENTE).length}
      </p>
    </button>
  );
}

export default ServiceCard;
