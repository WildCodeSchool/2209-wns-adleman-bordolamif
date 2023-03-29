import { useQuery } from '@apollo/client';
import { GET_ALL_TICKETS } from '@graphQL/query/ticketQuery';
import { useParams } from 'react-router';

function TvScreenPage() {
  const { id } = useParams();
  const { data: ticketsList } = useQuery(GET_ALL_TICKETS, { variables: { filter: 'today' } });
  return (
    <div className="flex flex-row">
      <div className="bg-gray-800 text-white">
        <h2>Tickets Appelés</h2>
        <p>Merci de vous rendre au guichet indiqué</p>
      </div>

      <div>
        <h2>Prochains tickets en attente</h2>
      </div>
    </div>
  );
}

export default TvScreenPage;
