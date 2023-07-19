import { StatusEnum } from '@utils/enum/StatusEnum';
import { ServiceData, TicketData } from '@utils/types/DataTypes';

interface Props {
    service: ServiceData
    ticketsList: TicketData[]
    handleOpenModal: (service: ServiceData) => void
}

function ServiceCard(props: Props) {
  const { service, handleOpenModal, ticketsList } = props;

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
          {ticketsList!.filter((ticket) => ticket.status === StatusEnum.EN_ATTENTE
          && ticket.service.id === service.id).length || 0}
        </span>
      </p>
    </button>
  );
}

export default ServiceCard;
