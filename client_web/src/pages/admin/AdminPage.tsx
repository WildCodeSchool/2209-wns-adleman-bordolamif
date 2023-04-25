import { useSubscription } from '@apollo/client';
import { CREATED_TICKET, UPDATED_TICKET } from '@graphQL/subscriptions/ticketSubscriptions';

function AdminPage() {
  const { data: createData, loading } = useSubscription(CREATED_TICKET);
  const { data: updateData, loading: upload } = useSubscription(UPDATED_TICKET);
  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h1 className="f-main-title">Tableau de bord</h1>
        <div className="f-decoration-line" />
        <p>Nouveau ticket mis à jour : { !upload && updateData!.updatedTicket!.name}</p>
        <p>Nouveau ticket créé : {!loading && createData.newTicket.name}</p>
      </div>
    </div>
  );
}
export default AdminPage;
