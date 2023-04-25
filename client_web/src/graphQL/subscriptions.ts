import { gql } from '@apollo/client';

export const TICKET_CRETED = gql`
  subscription NewTicket {
    newTicket {
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
        isSuspended
        role
      }
      counter {
        id
        name
      }
    }
  }
`;
