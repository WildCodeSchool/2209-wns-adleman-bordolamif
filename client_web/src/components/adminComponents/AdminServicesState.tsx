import { useQuery } from '@apollo/client';
import { GET_ALL_TICKETS } from '@graphQL/query/ticketQuery';
import { GET_ALL_WAITINGROOMS } from '@graphQL/query/waitingRoomQuery';
import { StatusEnum } from '@utils/enum/StatusEnum';
import { TicketData, WaitingRoomData } from '@utils/types/DataTypes';
import { useState } from 'react';
import GlobalServicesView from './GlobalServicesView';
import { GET_ALL_USERS } from '@graphQL/query/userQuery';
import WaitingRoomView from './WaitingRoomView';

function AdminServicesState() {
  const [selectedWaitingRoom, setSelectedWaitingRoom] = useState<string>('all');
  const { data: waitingRoomList } = useQuery(GET_ALL_WAITINGROOMS);
  const { data: ticketList } = useQuery(GET_ALL_TICKETS, { variables: { filter: 'today' } });
  const { data: connectedUsersList } = useQuery(GET_ALL_USERS, { variables: { connected: true } });

  const selectWaitingRoom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWaitingRoom(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-4 mt-4">
      <div className="bg-gray-200 rounded-2xl flex flex-row p-3">
        <select className="f-select" name="waitingRoom" onChange={selectWaitingRoom}>
          <option value="all">Toutes les salles d'attentes</option>
          {waitingRoomList
          && waitingRoomList.getAllWaitingRooms.map((waitingRoom:WaitingRoomData) => (
            <option key={waitingRoom.id} value={waitingRoom.id}>{waitingRoom.name}</option>
          ))}
        </select>
        <div className="text-xl flex flex-row items-center gap-20 ml-12">
          <p><span className="nunito-bold">Tickets en attente :</span> {ticketList && ticketList.getAllTickets
            .filter((ticket:TicketData) => ticket.status === StatusEnum.EN_ATTENTE).length}
          </p>
          <p><span className="nunito-bold">Tickets suspendus :</span> {ticketList && ticketList.getAllTickets
            .filter((ticket:TicketData) => ticket.status === StatusEnum.AJOURNE).length}
          </p>
          <p><span className="nunito-bold">Total :</span> {ticketList && ticketList.getAllTickets.length}
          </p>
        </div>
      </div>
      {
          selectedWaitingRoom === 'all'
          && (
          <GlobalServicesView
            waitingRoomList={waitingRoomList! && waitingRoomList.getAllWaitingRooms!}
            ticketList={ticketList! && ticketList.getAllTickets!}
            connectedUsersList={connectedUsersList! && connectedUsersList.getAllUsers!}
          />
          )
        }
      {
          selectedWaitingRoom !== 'all'
          && (
          <WaitingRoomView
            waitingRoom={waitingRoomList!
              && waitingRoomList.getAllWaitingRooms!
                .find((waitingRoom:WaitingRoomData) => waitingRoom.id
              === parseInt(selectedWaitingRoom, 10))}
            ticketList={ticketList! && ticketList.getAllTickets!}
            connectedUsersList={connectedUsersList! && connectedUsersList.getAllUsers!}
          />
          )
        }
    </div>

  );
}
export default AdminServicesState;
