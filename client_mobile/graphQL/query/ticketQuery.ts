import { gql } from '@apollo/client';

export const GET_ALL_TICKETS = gql`
  query GetAllTickets($filter: String) {
  getAllTickets(filter: $filter) {
    id
    name
    createdAt
    calledAt
    isFirstTime
    isReturned
    status
    mobileToken
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
}`;
