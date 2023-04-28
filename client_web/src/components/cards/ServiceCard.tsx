import { StatusEnum } from '@utils/enum/StatusEnum';
import { ServiceData } from '@utils/types/DataTypes';

interface Props {
    service: ServiceData
    handleOpenModal: (service: ServiceData) => void
}

function ServiceCard(props: Props) {
  const { service, handleOpenModal } = props;

  const today = new Date();

  return (
    <button type="button" className="bg-white p-10 rounded-3xl drop-shadow-xl focus:scale-95" onClick={() => handleOpenModal(service)}>
      <div className="flex flex-row mb-8 items-center justify-center gap-4">
        <div
          className="w-fit px-4 h-12 rounded-2xl pt-1 text-white nunito-bold text-2xl flex items-center justify-center"
          style={{ backgroundColor: `${service.color}` }}
        >
          {service.acronym}
        </div>
        <p className="text-3xl nunito-bold">{service.name}</p>
      </div>
      <p className="text-xl nunito-bold">{'Tickets en attente : '}
        <span>
          {service.tickets.filter((ticket) => ticket.status === StatusEnum.EN_ATTENTE
           && new Date(ticket.createdAt).getFullYear() === today.getFullYear()
           && new Date(ticket.createdAt).getMonth() === today.getMonth()
           && new Date(ticket.createdAt).getDate() === today.getDate()).length}
        </span>
      </p>
    </button>
  );
}

export default ServiceCard;
