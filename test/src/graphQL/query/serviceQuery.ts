import { gql } from '@apollo/client';

export const GET_ALL_SERVICES = gql`
query GetAllServices {
  getAllServices {
    id
    name
    color
    acronym
    isOpen
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
      status
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
    isOpen
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
