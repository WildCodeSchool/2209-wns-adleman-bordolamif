import { gql } from '@apollo/client';

export const CREATE_COUNTER = gql`
mutation CreateCounter($data: CounterInput!) {
  createCounter(data: $data) {
    id
    name
    user {
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

export const UPDATE_COUNTER = gql`
mutation UpdateCounter($data: CounterInput!, $updateCounterId: Int!) {
  updateCounter(data: $data, id: $updateCounterId) {
    id
    name
    user {
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

export const DELETE_COUNTER = gql`
mutation DeleteCounter($deleteCounterId: Int!) {
  deleteCounter(id: $deleteCounterId)
}
`;
