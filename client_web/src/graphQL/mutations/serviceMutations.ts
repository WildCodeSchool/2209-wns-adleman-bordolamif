import { gql } from '@apollo/client';

export const CREATE_SERVICE = gql`
mutation CreateService($data: ServiceInput!) {
  createService(data: $data) {
    id
    name
    color
    acronym
    open
    waitingRoom {
      id
      name
    }
  }
}
`;

export const UPDATE_SERVICE = gql`
mutation UpdateService($data: ServiceInput!, $updateServiceId: Int!) {
  updateService(data: $data, id: $updateServiceId) {
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
  }
}
`;

export const DELETE_SERVICE = gql`
mutation DeleteService($deleteServiceId: Int!) {
  deleteService(id: $deleteServiceId)
}
`;