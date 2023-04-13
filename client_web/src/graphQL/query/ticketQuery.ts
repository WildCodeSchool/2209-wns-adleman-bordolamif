import { gql } from '@apollo/client';

export const GET_ALL_TICKETS = gql`
query GetAllTickets($filter: String) {
  getAllTickets (filter: $filter){
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    status
    service {
      id
      name
      isOpen
      color
      acronym
    }
    user {
      id
      firstname
      lastname
      role
      email
    }
  }
}
`;

export const GET_ALL_TICKETS_FOR_WAITING_ROOM = gql`
query GetAllTicketsForWaitingRoom($waitingRoomId: Int!) {
  getAllTicketsForWaitingRoom(waitingRoomId: $waitingRoomId) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    status
    isReturned
    service {
      id
      name
      acronym
      isOpen
      color
    }
    user {
      id
      firstname
      lastname
      email
      role
    }
    counter {
      id
      name
    }
  }
}
`;

export const GET_ONE_TICKET = gql`
query GetOneTicket($getOneTicketId: Int!) {
  getOneTicket(id: $getOneTicketId) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    status
    service {
      id
      name
      color
      acronym
      isOpen
    }
    user {
      id
      firstname
      lastname
      email
      role
    }
  }
}
`;
