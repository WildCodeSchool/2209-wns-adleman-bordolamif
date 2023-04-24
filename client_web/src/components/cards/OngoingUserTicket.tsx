import ServiceIcon from '@components/icons/ServiceIcon';
import { StatusEnum } from '@utils/enum/StatusEnum';
import { UserData } from '@utils/types/DataTypes';

interface Props{
  profile: UserData | null
  callNextTicket: ()=> void
  changeCurrentTicketStatus: (stauts: StatusEnum)=>void
}

function OngoingUserTicket(props: Props) {
  const { profile, callNextTicket, changeCurrentTicketStatus } = props;

  return (
    <div className="bg-gray-200 rounded-2xl">
      {profile!.counter.ticket === null
      && (
      <div>
        <h2 className="f-dashboard-titles">Vous n'avez pas de ticket en cours</h2>
        <button onClick={callNextTicket} type="button" className="m-3 bg-green-500 rounded p-3">Appeler le prochain ticket</button>
      </div>
      )}
      {profile! && profile.counter.ticket! && profile.currentService!
      && (
      <div>
        <h2 className="f-dashboard-titles">Mon ticket en cours</h2>
        <div className="bg-white m-2 p-2 rounded">
          <ServiceIcon service={profile.currentService} />
          <p>{profile.currentService.name}</p>
          <p>{profile.counter.ticket.name}</p>
        </div>
        <div className="bg-white m-2 p-2 rounded">
          <p className="text-orange-500">Informations patient</p>
          {profile.counter.ticket.isFirstTime
            ? <p>C'est sa première visite</p>
            : <p>Ce patient est déjà venu</p>}
          {profile.counter.ticket.isReturned && <p>Ce ticket a déjà été suspendu</p>}
        </div>
        <button onClick={() => changeCurrentTicketStatus(StatusEnum.TRAITE)} type="button" className="bg-green-500 text-white rounded p-1 m-2">Traitement terminé</button>
        <button onClick={() => changeCurrentTicketStatus(StatusEnum.AJOURNE)} type="button" className="bg-gray-500 text-white rounded p-1 m-2">Suspendre le ticket</button>

      </div>
)}
    </div>
  );
}
export default OngoingUserTicket;
