import { gql } from '@apollo/client';

export const UPDATED_USER = gql`
  subscription UpdatedUser {
    updatedUser{
      id
      firstname
      lastname
      email
      role
      counter {
        id
        name
      }
      services {
        id
        name
        isOpen
        color
        acronym
      }
      tickets {
        id
        name
        createdAt
        calledAt
        closedAt
        isFirstTime
        isReturned
        status
      }
      currentService {
        id
        name
        isOpen
        color
        acronym
      }
    }
  }
`;
