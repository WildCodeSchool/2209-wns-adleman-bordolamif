import { useQuery, useSubscription } from '@apollo/client';
import { GET_ALL_TICKETS_FOR_WAITING_ROOM } from '@graphQL/query/ticketQuery';
import { useParams } from 'react-router';
import { Service, TicketData } from '@utils/types/DataTypes';
import CalledTicketByCounter from '@components/cards/CalledTicketByCounter';
import WaitingTicketsByService from '@components/cards/WaitingTicketsByService';
import { GET_ONE_WAITINGROOM } from '@graphQL/query/waitingRoomQuery';
import { StatusEnum } from '@utils/enum/StatusEnum';
import DarkLogo from '@assets/DarkLogo';
import { CREATED_TICKET, UPDATED_TICKET } from '@graphQL/subscriptions/ticketSubscriptions';
import { useEffect } from 'react';

function TvScreenPage() {
  const { id } = useParams();
  const { data: ticketsList, subscribeToMore } = useQuery(
    GET_ALL_TICKETS_FOR_WAITING_ROOM,
    { variables: { waitingRoomId: parseInt(id!, 10) } },
  );

  const { data: waitingRoom } = useQuery(
    GET_ONE_WAITINGROOM,
    { variables: { getOneWaitingRoomId: parseInt(id!, 10) } },
  );

  const { data: createdTicket, loading: createdTicketLoading } = useSubscription(CREATED_TICKET);
  const { data: updatedTicket, loading: updatedTicketLoading } = useSubscription(UPDATED_TICKET);

  useEffect(() => {
    subscribeToMore({
      document: CREATED_TICKET,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const ticketToAdd = subscriptionData.data.newTicket;
        return {
          ...prev,
          getAllTicketsForWaitingRoom: {
            ...ticketsList.getAllTicketsForWaitingRoom, ticketToAdd,
          },
        };
      },
    });
  }, [createdTicket, id, subscribeToMore, ticketsList]);

  // useEffect pour updatedTicket

  return (
    <div className="flex flex-row min-h-screen">
      { ticketsList && ticketsList! && (
      <CalledTicketByCounter
        ticketsList={ticketsList.getAllTicketsForWaitingRoom
          .filter((ticket:TicketData) => waitingRoom.service.includes(ticket.service)
          && ticket.counter !== null)}
      />
      )}
      <div className="w-2/3 flex flex-col">
        <h2 className="text-5xl nunito-bold mx-auto mt-12 mb-10">
          Prochains tickets en attente
        </h2>
        <div className="flex flex-row gap-8 flex-wrap justify-start ml-12">
          {waitingRoom! && waitingRoom.getOneWaitingRoom.services.map(
            (service: Service) => (
              <WaitingTicketsByService
                key={service.id}
                ticketsList={ticketsList! && ticketsList
                  .getAllTicketsForWaitingRoom
                  .filter((ticket:TicketData) => ticket.service.id === service.id
                && ticket.status !== StatusEnum.EN_TRAITEMENT)}
                service={service}
              />
            ),
          )}
        </div>
      </div>
      <div className="absolute left-10 bottom-5 scale-150">
        <DarkLogo />
      </div>
    </div>
  );
}

export default TvScreenPage;
