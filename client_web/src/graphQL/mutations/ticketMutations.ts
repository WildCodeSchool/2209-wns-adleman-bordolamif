import { gql } from '@apollo/client';

export const CREATE_TICKET = gql`
mutation CreateTicket($data: TicketInput!) {
  createTicket(data: $data) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    status
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
      isOpen
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
      isOpen
    }
    name
    isReturned
    isFirstTime
    id
    closedAt
    calledAt
    createdAt
    status
  }
}
`;

export const PARTIAL_TICKET_UPDATE = gql`
mutation PartialTicketUpdate($data: PartialTicketInput!, $partialTicketUpdateId: Int!) {
  partialTicketUpdate(data: $data, id: $partialTicketUpdateId) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    status
    isReturned
  }}`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($deleteTicketId: Int!) {
    deleteTicket(id: $deleteTicketId)
  }
`;

export const SEND_NOTIFICATION = gql`
  mutation SendNotification($id: Int!) {
    sendNotification(id: $id)
  }
`;
