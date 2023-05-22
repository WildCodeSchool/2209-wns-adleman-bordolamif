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

export const PARTIAL_COUNTER_UPDATE = gql`
mutation PartialCounterUpdate($data: PartialCounterInput!, $partialCounterUpdateId: Int!) {
  partialCounterUpdate(data: $data, id: $partialCounterUpdateId) {
        id
    name
    waitingRoom {
      id
      name
    }
    user {
      id
      firstname
    }
    ticket {
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
