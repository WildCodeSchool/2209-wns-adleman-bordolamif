import { gql } from '@apollo/client';

export const CREATED_TICKET = gql`
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

export const UPDATED_TICKET = gql`
  subscription UpdatedTicket {
    updatedTicket {
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
        waitingRoom {
          id
        }
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
