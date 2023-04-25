import { useSubscription } from '@apollo/client';
import { TICKET_CRETED } from '@graphQL/subscriptions';

function AdminPage() {
  const { data, loading } = useSubscription(TICKET_CRETED);

  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h1 className="f-main-title">Tableau de bord</h1>
        <div className="f-decoration-line" />

        <p>Nouveau ticket créé : {!loading && data.newTicket.name}</p>
      </div>
    </div>
  );
}
export default AdminPage;
