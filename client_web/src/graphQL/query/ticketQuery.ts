import { gql } from '@apollo/client';

export const GET_ALL_TICKETS = gql`
query GetAllTickets($filter: String) {
  getAllTickets (filter: $filter){
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    status
    service {
      id
      name
      isOpen
      color
      acronym
    }
    user {
      id
      firstname
      lastname
      role
      email
    }
  }
}
`;

export const GET_ALL_TICKETS_BETWEEN_TWO_DATES = gql`
query GetAllTicketsBetweenTwoDates($data: StartEndDate!) {
  getAllTicketsBetweenTwoDates(data: $data) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    status
    isReturned
    service {
      id
      name
      acronym
      isOpen
      color
      waitingRoom {
        id
        name
      }
    }
    counter {
      id
      name
    }
  }
}
`;

export const GET_ALL_TICKETS_FOR_WAITING_ROOM = gql`
query GetAllTicketsForWaitingRoom($waitingRoomId: Int!) {
  getAllTicketsForWaitingRoom(waitingRoomId: $waitingRoomId) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    status
    isReturned
    service {
      id
      name
      acronym
      isOpen
      color
    }
    user {
      id
      firstname
      lastname
      email
      role
    }
    counter {
      id
      name
    }
  }
}
`;

export const GET_ONE_TICKET = gql`
query GetOneTicket($getOneTicketId: Int!) {
  getOneTicket(id: $getOneTicketId) {
    id
    name
    createdAt
    calledAt
    closedAt
    isFirstTime
    isReturned
    status
    service {
      id
      name
      color
      acronym
      isOpen
    }
    user {
      id
      firstname
      lastname
      email
      role
    }
  }
}
`;

export const GET_LAST_YEAR_STATISTICS = gql`
query GetLastYearStatistics {
  getLastYearStatistics {
    date
    total
    detail {
      service
      number
      waitingTimeAverage
      mobileRate
      firstTimeRate
      returnedRate
    }
  }
}
`;
