import { gql } from '@apollo/client';

export const CREATE_WAITINGROOM = gql`
mutation CreateWaitingRoom($data: WaitingRoomInput!) {
  createWaitingRoom(data: $data) {
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

export const UPDATE_WAITINGROOM = gql`
mutation UpdateWaitingRoom($data: WaitingRoomInput!, $updateWaitingRoomId: Int!) {
  updateWaitingRoom(data: $data, id: $updateWaitingRoomId) {
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

export const DELETE_WAITINGROOM = gql`
mutation DeleteWaitingRoom($deleteWaitingRoomId: Int!) {
  deleteWaitingRoom(id: $deleteWaitingRoomId)
}
`;
