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
          <div className="flex flex-row items-center mt-2 ml-2">
            <ServiceIcon service={service} />
            <p className="ml-2 text-2xl">{service.name}</p>
          </div>
          <div className="flex flex-row">
            <div className="bg-white rounded-2xl m-2 p-3 w-1/3">
              <p className="text-xl nunito-bold">Etat du service</p>
              <p className="text-lg">
                Tickets en attente : {ticketList && ticketList
                .filter((ticket:TicketData) => ticket.status
              === StatusEnum.EN_ATTENTE && ticket.service.id === service.id).length}
              </p>
              <p className="text-lg">
                Tickets suspendus : {ticketList && ticketList
                .filter((ticket:TicketData) => ticket.status === StatusEnum.AJOURNE
              && ticket.service.id === service.id).length}
              </p>
              <p className="text-lg">
                Total : {ticketList && ticketList
                .filter((ticket:TicketData) => ticket.status !== StatusEnum.TRAITE
              && ticket.service.id === service.id).length}
              </p>
              <p className="text-lg">
                Guichets ouverts : {connectedUsersList
                && connectedUsersList.filter((user) => user.currentService?.id
                === service.id).length}
              </p>
            </div>
            <div className="bg-white rounded-2xl m-2 w-2/3">
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
