import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($data:UserConnexion!) {
  login(data: $data)
}
`;

export const LOGOUT = gql`
mutation logout{
  logout
}
`;

export const CREATE_USER = gql`
mutation CreateUser($data: UserInput!) {
  createUser(data: $data) {
    role
    lastname
    id
    firstname
    email
    services {
      id
      color
      acronym
      name
      open
    }
  }
}
`;

export const UPDATE_USER = gql`
mutation UpdateUser($data: UserInput!, $updateUserId: Int!) {
  updateUser(data: $data, id: $updateUserId) {
    id
    firstname
    lastname
    email
    role
    counter {
      id
      name
    }
    services {
      id
      name
      open
      color
      acronym
    }
    tickets {
      id
      name
      CreatedAt
      calledAt
      closedAt
      isFirstTime
      isReturned
    }
  }
}
`;

export const DELETE_USER = gql`
mutation DeleteUser($deleteUserId: Int!) {
  deleteUser(id: $deleteUserId)
}
`;
