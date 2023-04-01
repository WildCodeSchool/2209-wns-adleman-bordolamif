import ServiceIcon from '@components/icons/ServiceIcon';
import { StatusEnum } from '@utils/enum/StatusEnum';
import { TicketData, UserData, WaitingRoomData } from '@utils/types/DataTypes';

interface Props {
    profile: UserData | null
    waitingRoom: WaitingRoomData
    ticketsList: TicketData[]
    connectedUsersList: UserData[]
}

function DashboardOverview(props:Props) {
  const {
    profile, waitingRoom, ticketsList, connectedUsersList,
  } = props;
  return (
    <div className="bg-gray-200 rounded-2xl">
      <h2 className="f-dashboard-titles">Vue d'ensemble</h2>
      <div className="bg-white">
        {waitingRoom! && waitingRoom.services.map((service) => (
          <div key={service.id}>
            <ServiceIcon service={service} />
            <p>Tickets en attente : {ticketsList!
            && ticketsList.filter((ticket) => ticket.service.id
            === service.id && ticket.status !== StatusEnum.TRAITE).length}
            </p>
            <p>Guichets ouverts : {connectedUsersList! && connectedUsersList.filter(
              (user) => user.currentService!.id === service.id,
            ).length}
            </p>
          </div>
        ))}
      </div>
      {profile! && (
      <div>
        <div className="bg-orange-500 rounded text-white p-1">{profile.firstname.toUpperCase().split('')[0] + profile.lastname.toUpperCase().split('')[0]}</div>
        <p>{profile.firstname.toUpperCase().split('')[0]}. {profile.lastname.charAt(0).toUpperCase() + profile.lastname.toLowerCase().slice(1)}</p>
        <p>Guichet {profile.counter!.name}</p>
      </div>
)}
    </div>
  );
}

export default DashboardOverview;
