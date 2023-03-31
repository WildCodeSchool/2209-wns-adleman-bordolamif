import { gql } from '@apollo/client';

export const GET_ALL_WAITINGROOMS = gql`
query GetAllWaitingRooms {
  getAllWaitingRooms {
    id
    name
    counters {
      id
      name
    }
    services {
      id
      name
      color
      acronym
      isOpen
    }
  }
}
`;

export const GET_ONE_WAITINGROOM = gql`
query GetOneWaitingRoom($getOneWaitingRoomId: Int!) {
  getOneWaitingRoom(id: $getOneWaitingRoomId) {
    id
    name
    counters {
      id
      name
      user {
        id
      }
    }
    services {
      id
      name
      color
      acronym
      isOpen
    }
  }
}
`;
