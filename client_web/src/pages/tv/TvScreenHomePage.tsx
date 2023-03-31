import { useQuery } from '@apollo/client';
import ServiceIcon from '@components/icons/ServiceIcon';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { WaitingRoomData } from '@utils/types/DataTypes';
import { useNavigate } from 'react-router';

function TvScreenHomePage() {
  const { data: waitingRoomsList } = useQuery(GET_ALL_WAITINGROOMS);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h2 className="f-under-title text-3xl">Merci de selectionner la salle d'attente que vous souhaitez afficher</h2>
      <div className="scale-150 mt-8">
        {waitingRoomsList!
      && waitingRoomsList.getAllWaitingRooms.map((waitingRoom: WaitingRoomData) => (
        <button
          onClick={() => navigate(`${waitingRoom.id}`)}
          type="button"
          className="rounded-xl p-3 m-2 bg-white drop-shadow"
          key={waitingRoom.id}
        >
          <p className="mb-4">{waitingRoom.name}</p>
          <div className="flex gap-4">
            {waitingRoom.services!
           && waitingRoom.services.map((service) => (
             <ServiceIcon key={service.id} service={service} />))}
          </div>

        </button>
      ))}
      </div>
    </div>
  );
}

export default TvScreenHomePage;
