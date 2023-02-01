import { gql } from '@apollo/client';

export const GET_ALL_COUNTERS = gql`
query GetAllCounters {
  getAllCounters {
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

export const GET_ONE_COUNTER = gql`
query GetOneCounter($getOneCounterId: Int!) {
  getOneCounter(id: $getOneCounterId) {
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
