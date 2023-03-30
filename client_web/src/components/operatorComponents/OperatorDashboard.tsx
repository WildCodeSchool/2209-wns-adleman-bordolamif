import ManWithComputer from '../../assets/illustrations/ManWithComputer.png';

function OperatorDashboard() {
  return (
    <div>
      <div className="flex flex-col space-y-4 mt-4">
        <div className="bg-gray-200 rounded-2xl">
          <h2 className="f-dashboard-titles">Mon ticket en cours</h2>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="bg-gradient-to-b from-orange-500 to-red-500 w-1/3 rounded-2xl">
            <h2 className="f-dashboard-titles text-white">Tickets en attentes</h2>
          </div>
          <div className="bg-gray-200 w-1/3 rounded-2xl">
            <h2 className="f-dashboard-titles">Tickets suspendus</h2>
          </div>
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl">
              <h2 className="f-dashboard-titles text-center">Opérateurs sur le service</h2>
            </div>
            <img className="w-[350px]" src={ManWithComputer} alt="WomanWithComputer" />
          </div>
        </div>
        <div className="bg-gray-200 rounded-2xl">
          <h2 className="f-dashboard-titles">Vue d'ensemble</h2>
        </div>
      </div>
    </div>
  );
}
export default OperatorDashboard;
