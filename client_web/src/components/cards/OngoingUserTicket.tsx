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
    <div className="f-format-gray">
      {profile!.counter.ticket === null
      && (
      <div className="flex flex-row p-8 items-center justify-between">
        <h2 className="text-2xl ml-2">Vous n'avez pas de ticket en cours</h2>
        <button onClick={callNextTicket} type="button" className="f-button-green">Appeler le prochain ticket</button>
      </div>
      )}
      {profile! && profile.counter.ticket! && profile.currentService!
      && (
      <div>
        <h2 className="f-dashboard-titles">Mon ticket en cours</h2>
        <div className="flex flex-row gap-10 items-center justify-between mx-20 mb-6 mt-2">
          <div className="f-format-ope-dash items-center">
            <div className="flex flex-row gap-4">
              <ServiceIcon service={profile.currentService} />
              <p className="text-2xl nunito-bold">{profile.currentService.name}</p>
            </div>
            <p className="text-3xl">{profile.counter.ticket.name}</p>
          </div>
          <div className="f-format-ope-dash justify-start ml-8 m-4">
            <p className="text-orange-500 nunito-bold text-2xl">Informations patient</p>
            {profile.counter.ticket.isFirstTime
              ? <p>C'est sa première visite</p>
              : <p>Ce patient est déjà venu</p>}
            {profile.counter.ticket.isReturned && <p>Ce ticket a déjà été suspendu</p>}
          </div>
          <div className="flex flex-col gap-6 items-center">
            <button
              onClick={() => changeCurrentTicketStatus(StatusEnum.TRAITE)}
              type="button"
              className="f-button-green drop-shadow-lg py-4 px-8 text-xl"
            >
              Traitement terminé
            </button>
            <button
              onClick={() => changeCurrentTicketStatus(StatusEnum.AJOURNE)}
              type="button"
              className="f-button-red drop-shadow-lg"
            >
              Suspendre le ticket
            </button>
          </div>
        </div>
      </div>
)}
    </div>
  );
}
export default OngoingUserTicket;
