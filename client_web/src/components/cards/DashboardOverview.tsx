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
    <div className="f-format-gray">
      <h2 className="f-dashboard-titles">Vue d'ensemble</h2>
      <div className="flex flex-row items-center justify-center gap-28">
        <div className="bg-white w-3/5 rounded-2xl grid grid-cols-2 my-6">
          {waitingRoom! && waitingRoom.services.map((service) => (
            <div className="flex flex-row items-center gap-2 ml-4 my-2 py-2" key={service.id}>
              <ServiceIcon service={service} />
              <div className="flex flex-col">
                <p>
                  Tickets en attente : {ticketsList!
            && ticketsList.filter((ticket) => ticket.service.id
            === service.id && ticket.status !== StatusEnum.TRAITE).length}
                </p>
                <p>
                  Guichets ouverts : {connectedUsersList! && connectedUsersList.filter(
                  (user) => user.currentService! && user.currentService!.id === service.id,
                ).length}
                </p>
              </div>
            </div>
          ))}
        </div>
        {profile! && (
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className="bg-orange-500 rounded text-white p-3 w-fit text-4xl nunito-bold"
          >
            {profile.firstname.toUpperCase().split('')[0] + profile.lastname.toUpperCase().split('')[0]}
          </div>
          <p className="text-2xl nunito-bold">{profile.firstname.toUpperCase().split('')[0]}. {profile.lastname.charAt(0).toUpperCase() + profile.lastname.toLowerCase().slice(1)}</p>
          <p className="text-2xl">{profile.counter!.name}</p>
        </div>
)}
      </div>
    </div>
  );
}

export default DashboardOverview;
