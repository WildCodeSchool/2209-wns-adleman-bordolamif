import { useParams } from 'react-router';

function TvScreenPage() {
  const { id } = useParams();
  // Je veux récupérer les tickets du jour non traités qui
  // correspondent aux services de ma waiting room

  // Je veux récupérer tous les tickets qui n'ont pas le status traité
  // Je veux récupérer tous les tickets du jour
  // Je veux récupérer tous les tickets des services de ma waiting room

  return (
    <div className="flex flex-row">
      <div className="bg-gray-800 text-white">
        <h2>Tickets Appelés {id}</h2>
        <p>Merci de vous rendre au guichet indiqué</p>
      </div>

      <div>
        <h2>Prochains tickets en attente</h2>
      </div>
    </div>
  );
}

export default TvScreenPage;
