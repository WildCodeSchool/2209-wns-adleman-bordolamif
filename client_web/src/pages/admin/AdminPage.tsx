import { useSubscription } from '@apollo/client';
import { CREATED_TICKET, UPDATED_TICKET } from '@graphQL/subscriptions/ticketSubscriptions';

function AdminPage() {
  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h1 className="f-main-title">Tableau de bord</h1>
        <div className="f-decoration-line" />
      </div>
    </div>
  );
}
export default AdminPage;
