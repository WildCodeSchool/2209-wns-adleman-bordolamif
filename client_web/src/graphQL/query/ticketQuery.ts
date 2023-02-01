import { gql } from '@apollo/client';

export const GET_ALL_TICKETS = gql`
query GetAllTickets {
  getAllTickets {
    id
    name
    CreatedAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    service {
      id
      name
      open
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

export const GET_ONE_TICKET = gql`
query GetOneTicket($getOneTicketId: Int!) {
  getOneTicket(id: $getOneTicketId) {
    id
    name
    CreatedAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    service {
      id
      name
      color
      acronym
      open
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
