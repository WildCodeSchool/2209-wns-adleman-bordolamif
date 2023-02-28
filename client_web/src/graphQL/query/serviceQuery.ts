import { gql } from '@apollo/client';

export const GET_ALL_SERVICES = gql`
query GetAllServices {
  getAllServices {
    id
    name
    color
    acronym
    open
    users {
      id
      firstname
      lastname
      email
    }
    tickets {
      id
      name
      createdAt
      calledAt
      closedAt
      isFirstTime
      isReturned
    }
    waitingRoom {
      id
      name
    }
    currentUsers {
      id
      firstname
      lastname
      email
      role
    }
  }
}
`;

export const GET_ONE_SERVICE = gql`
query GetOneService($getOneServiceId: Int!) {
  getOneService(id: $getOneServiceId) {
    id
    name
    color
    acronym
    open
    tickets {
      id
      name
      createdAt
      calledAt
      closedAt
      isFirstTime
      isReturned
    }
    users {
      id
      firstname
      lastname
      email
      role
    }
    waitingRoom {
      id
      name
    }
    currentUsers {
      id
      firstname
      lastname
      email
    }
  }
}
`;
