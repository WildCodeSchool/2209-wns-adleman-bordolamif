import { gql } from '@apollo/client';

export const CREATE_TICKET = gql`
mutation CreateTicket($data: TicketInput!) {
  createTicket(data: $data) {
    id
    name
    CreatedAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    user {
      id
      firstname
      lastname
      email
      role
    }
    service {
      id
      name
      open
      color
      acronym
    }
  }
}
`;

export const UPDATE_TICKET = gql`
mutation UpdateTicket($data: TicketInput!, $updateTicketId: Int!) {
  updateTicket(data: $data, id: $updateTicketId) {
    user {
      id
      firstname
      lastname
      role
      email
    }
    service {
      id
      name
      color
      acronym
      open
    }
    name
    isReturned
    isFirstTime
    id
    closedAt
    calledAt
    CreatedAt
  }
}
`;

export const DELETE_TICKET = gql`
mutation DeleteTicket($deleteTicketId: Int!) {
  deleteTicket(id: $deleteTicketId)
}
`;
