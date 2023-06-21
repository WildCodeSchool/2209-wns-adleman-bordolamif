import { gql } from '@apollo/client';

export const UPDATED_TICKET_BY_SERVICE_ID = gql`
subscription UpdatedTicketByServiceId($id: Int!) {
  updatedTicketByServiceId(id: $id) {
    id
    name
    createdAt
    status
    service {
      id
      name
    }
    counter {
      id
      name
    }
  }
}`;
