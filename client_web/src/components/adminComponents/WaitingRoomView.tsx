import OperatorsInService from '@components/cards/OperatorsInService';
import ServiceIcon from '@components/icons/ServiceIcon';
import { StatusEnum } from '@utils/enum/StatusEnum';
import { TicketData, UserData, WaitingRoomData } from '@utils/types/DataTypes';

interface Props {
    waitingRoom: WaitingRoomData
    ticketList: TicketData[]
    connectedUsersList: UserData[]
}

function WaitingRoomView(props: Props) {
  const { waitingRoom, ticketList, connectedUsersList } = props;
  return (
    <div>
      {waitingRoom.services.map((service) => (
        <div className="bg-gray-200 rounded-2xl m-2 p-2" key={service.id}>
          <div className="flex flex-row items-center">
            <ServiceIcon service={service} />
            <p className="ml-1">{service.name}</p>
          </div>
          <div className="flex flex-row">
            <div className="bg-white rounded m-1 p-1">
              <p>Etat du service</p>
              <p>Tickets en attente : {ticketList && ticketList
                .filter((ticket:TicketData) => ticket.status
              === StatusEnum.EN_ATTENTE && ticket.service.id === service.id).length}
              </p>
              <p>Tickets suspendus : {ticketList && ticketList
                .filter((ticket:TicketData) => ticket.status === StatusEnum.AJOURNE
              && ticket.service.id === service.id).length}
              </p>
              <p>Total : {ticketList && ticketList
                .filter((ticket:TicketData) => ticket.status !== StatusEnum.TRAITE
              && ticket.service.id === service.id).length}
              </p>
              <p>Guichets ouverts : {connectedUsersList
                && connectedUsersList.filter((user) => user.currentService?.id
                === service.id).length}
              </p>
            </div>
            <div className="bg-white rounded">
              <OperatorsInService connectedUsersList={connectedUsersList
                && connectedUsersList.filter((user) => user.currentService?.id
                === service.id)}
              />
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default WaitingRoomView;
