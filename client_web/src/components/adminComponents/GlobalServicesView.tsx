import TicketsByServicesChart from '@components/charts/TicketsByServicesChart';
import ServiceIcon from '@components/icons/ServiceIcon';
import UserIcon from '@components/icons/UserIcon';
import { StatusEnum } from '@utils/enum/StatusEnum';
import { TicketData, UserData, WaitingRoomData } from '@utils/types/DataTypes';

interface Props{
    ticketList: TicketData[]
    waitingRoomList: WaitingRoomData[]
    connectedUsersList: UserData[]
}

function GlobalServicesView(props: Props) {
  const { ticketList, waitingRoomList, connectedUsersList } = props;

  function computeDataForChart() {
    const servicesData: { [serviceId: number]
        : { name: string; color: string; count: number } } = {};
    if (ticketList) {
      ticketList.forEach((ticket) => {
        const serviceId = ticket.service.id;
        if (!servicesData[serviceId]) {
          servicesData[serviceId] = {
            name: ticket.service.name,
            color: ticket.service.color,
            count: 1,
          };
        } else {
          servicesData[serviceId].count += 1;
        }
      });
    }
    const chartData = Object.values(servicesData).map((serviceData) => ({
      name: serviceData.name,
      color: serviceData.color,
      ticketsNb: serviceData.count,
    }));
    return chartData;
  }

  return (
    <div>
      <div className="f-format-around-center">
        <div className="">
          <TicketsByServicesChart chartData={computeDataForChart()} />
        </div>
        <table className="divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="f-text-left-services">
                Mes services
              </th>
              <th scope="col" className="f-text-left-services">
                Status du service
              </th>
              <th scope="col" className="f-text-left-services">
                Tickets en attente
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {ticketList && waitingRoomList.map((waitingRoom) => (
              waitingRoom.services.map((service) => (
                <tr key={service.id}>
                  <td className="py-2 pl-4 pr-3">
                    <div className="flex items-center">
                      <ServiceIcon service={service} />
                      <div className="ml-2">{service.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div>{service.isOpen ? <p>Ouvert</p> : <p>Fermé</p>}</div>
                  </td>
                  <td className="px-3 py-2 ">
                    <div>{ticketList && ticketList.filter((ticket) => ticket.service.id
                  === service.id && ticket.status === StatusEnum.EN_ATTENTE).length}
                    </div>
                  </td>
                </tr>
              ))))}
          </tbody>
        </table>
      </div>
      <p>Opérateurs en poste : </p>
      <div className="f-format-view">
        <div className="bg-white rounded-xl p-3">
          {connectedUsersList && connectedUsersList
            .map((user) => (<UserIcon key={user.id} user={user} />))}
        </div>
      </div>
    </div>
  );
}
export default GlobalServicesView;
