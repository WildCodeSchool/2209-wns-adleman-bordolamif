import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($data:UserConnexion!) {
  login(data: $data)
}
`;

export const LOGOUT = gql`
mutation logout($logoutId: Int!){
  logout(id: $logoutId)
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
      isOpen
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
      isOpen
      color
      acronym
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
    currentService{
      id
      name
      isOpen
      color
      acronym
    }
  }
}
`;

export const DELETE_USER = gql`
mutation DeleteUser($deleteUserId: Int!) {
  deleteUser(id: $deleteUserId)
}
`;

export const UPDATE_USER_PASSWORD = gql`
mutation FirstLoginPassword($data: FirstUserLoginPassword!, $firstLoginPasswordId: Int!) {
  firstLoginPassword(data: $data, id: $firstLoginPasswordId) {
    email
    isFirstLogin
  }
}
`;
