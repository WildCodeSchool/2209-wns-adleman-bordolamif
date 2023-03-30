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
      <h2>Merci de selectionner la salle d'attente que vous souhaitez afficher</h2>
      {waitingRoomsList!
      && waitingRoomsList.getAllWaitingRooms.map((waitingRoom: WaitingRoomData) => (
        <button onClick={() => navigate(`${waitingRoom.id}`)} type="button" className="border-2 rounded-xl p-3 m-2" key={waitingRoom.id}>
          <p>{waitingRoom.name}</p>
          <div className="flex gap-2">{waitingRoom.services!
           && waitingRoom.services.map((service) => (
             <ServiceIcon key={service.id} service={service} />))}
          </div>

        </button>
      ))}
    </div>
  );
}

export default TvScreenHomePage;
