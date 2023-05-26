import { useMutation, useQuery, useSubscription } from '@apollo/client';
import OperatorDashboard from '@components/operatorComponents/OperatorDashboard';
import { PARTIAL_COUNTER_UPDATE } from '@graphQL/mutations/counterMutations';
import { PARTIAL_TICKET_UPDATE, SEND_NOTIFICATION } from '@graphQL/mutations/ticketMutations';
import { GET_ALL_TICKETS_FOR_WAITING_ROOM } from '@graphQL/query/ticketQuery';
import { GET_ALL_USERS } from '@graphQL/query/userQuery';
import { GET_ONE_WAITINGROOM } from '@graphQL/query/waitingRoomQuery';
import { CREATED_TICKET, UPDATED_TICKET } from '@graphQL/subscriptions/ticketSubscriptions';
import { UPDATED_USER } from '@graphQL/subscriptions/userSubscriptions';
import { useUserProfile } from '@layouts/StaffLayout';
import { StatusEnum } from '@utils/enum/StatusEnum';
import useModal from '@utils/hooks/UseModal';
import { TicketData, UserData } from '@utils/types/DataTypes';
import { useEffect, useState } from 'react';

function OperatorBoard() {
  const { userProfile } = useUserProfile();
  const [treatedTicket, setTreatedTicket] = useState<string>('');

  const { isModalOpen, openModal, closeModal } = useModal();

  const { data: ticketsList, refetch, subscribeToMore: subscribeToMoreTicket } = useQuery(
    GET_ALL_TICKETS_FOR_WAITING_ROOM,
    {
      variables: {
        waitingRoomId: userProfile?.counter!.waitingRoom.id,
        skip: userProfile,
      },
    },
  );

  const { data: waitingRoom } = useQuery(
    GET_ONE_WAITINGROOM,
    {
      variables: {
        getOneWaitingRoomId: userProfile?.counter!.waitingRoom.id,
        skip: userProfile,
      },
    },
  );

  const { data: createdTicket } = useSubscription(CREATED_TICKET);
  const { data: updatedTicket, loading: updateTicketLoading } = useSubscription(UPDATED_TICKET);
  const { data: updatedUser, loading: updateUserLoading } = useSubscription(UPDATED_USER);

  const {
    data: connectedUsersList,
    subscribeToMore: subscribeToMoreUser,
  } = useQuery(GET_ALL_USERS, {
    variables: { connected: true },
  });

  useEffect(() => {
    subscribeToMoreTicket({
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
  }, [createdTicket, subscribeToMoreTicket, ticketsList]);

  useEffect(() => {
    if (!updateTicketLoading && updatedTicket!) {
      subscribeToMoreTicket({
        document: UPDATED_TICKET,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const ticketToUpdate = subscriptionData.data.updatedTicket;

          const newList = prev.getAllTicketsForWaitingRoom.map(
            (ticket: TicketData) => (ticket.id === ticketToUpdate.id ? ticketToUpdate : ticket),
          );
          return {
            ...prev,
            getAllTicketsForWaitingRoom: newList,
          };
        },
      });
    }
  }, [updatedTicket, subscribeToMoreTicket, updateTicketLoading]);

  useEffect(() => {
    if (!updateUserLoading && updatedUser) {
      subscribeToMoreUser({
        document: UPDATED_USER,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const userToUpdate = subscriptionData.data.updatedUser;

          // Retirer l'utilisateur de la liste s'il n'a pas de guichet
          if (!userToUpdate.currentService || userToUpdate.currentService === null) {
            return {
              ...prev,
              getAllUsers: prev.getAllUsers.filter((user:UserData) => user.id !== userToUpdate.id),
            };
          }

          // Actualiser l'utilisateur s'il est déjà dans la liste
          const existingUserIndex = prev.getAllUsers.findIndex(
            (user:UserData) => user.id === userToUpdate.id,
          );
          if (existingUserIndex !== -1) {
            const updatedUsers = [...prev.getAllUsers];
            updatedUsers[existingUserIndex] = userToUpdate;
            return {
              ...prev,
              getAllUsers: updatedUsers,
            };
          }

          // Ajouter l'utilisateur à la fin de la liste s'il n'y est pas déjà
          return {
            ...prev,
            getAllUsers: [...prev.getAllUsers, userToUpdate],
          };
        },
      });
    }
  }, [updatedUser, subscribeToMoreUser, updateUserLoading]);

  const [PartialTicketUpdate] = useMutation(PARTIAL_TICKET_UPDATE);
  const [PartialCounterUpdate] = useMutation(PARTIAL_COUNTER_UPDATE);
  const [SendNotification] = useMutation(SEND_NOTIFICATION);

  const callNextTicket = async () => {
    const nextTicket = ticketsList.getAllTicketsForWaitingRoom
      .find((ticket: TicketData) => ticket.service.id
            === userProfile!.currentService!.id && ticket.status === StatusEnum.EN_ATTENTE);
    await SendNotification({ variables: { id: nextTicket.id } });
    await updateTicketAndCounter(nextTicket.id);
  };

  const callSuspendedTicket = (id: number) => {
    updateTicketAndCounter(id);
  };

  const updateTicketAndCounter = async (ticketId: number) => {
    await PartialCounterUpdate({
      variables: {
        data: { ticket: { id: ticketId } }, partialCounterUpdateId: userProfile?.counter!.id,
      },
    });
    await PartialTicketUpdate({
      variables: {
        data: { status: StatusEnum.EN_TRAITEMENT },
        partialTicketUpdateId: ticketId,
      },
    });
  };

  const changeCurrentTicketStatus = async (status: StatusEnum) => {
    try {
      await PartialTicketUpdate({
        variables: {
          data: { status },
          partialTicketUpdateId: userProfile?.counter!.ticket.id,
        },
      });
      await PartialCounterUpdate({
        variables: {
          data: { ticket: { id: 0 } }, partialCounterUpdateId: userProfile?.counter!.id,
        },
      });
      if (status === StatusEnum.TRAITE) {
        setTreatedTicket(userProfile!.counter!.ticket.name);
        openModal();
        setTimeout(() => closeModal(), 4000);
      }
      await refetch();
    } catch (e) {
      throw new Error('Error while updating ticket');
    }
  };

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <>
      <div>
        <div className="flex flex-col items-center mb-4">
          <h1 className="f-main-title">Tableau de bord</h1>
        </div>
        <div className="f-decoration-line-for-tab" />
      </div>
      {ticketsList! && (
        <OperatorDashboard
          changeCurrentTicketStatus={changeCurrentTicketStatus}
          profile={userProfile!}
          ticketsList={ticketsList! && ticketsList.getAllTicketsForWaitingRoom}
          callNextTicket={callNextTicket}
          waitingRoom={waitingRoom! && waitingRoom.getOneWaitingRoom}
          connectedUsersList={connectedUsersList!
          && connectedUsersList.getAllUsers}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          treatedTicket={treatedTicket}
          callSuspendedTicket={callSuspendedTicket}
        />
      )}

    </>
  );
}
export default OperatorBoard;
