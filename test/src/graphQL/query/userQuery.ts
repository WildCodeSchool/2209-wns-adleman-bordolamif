import { gql } from '@apollo/client';

export const PROFILE = gql`
query getProfile {
  profile{
    id
    email
    role
    firstname
    lastname
    isFirstLogin
  }
}
`;

export const GET_ALL_USERS = gql`
query GetAllUsers {
  getAllUsers {
    id
    firstname
    lastname
    email
    role
    isFirstLogin
    services {
      acronym
      color
      id
      name
      open
    }
    counter {
      id
      name
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
    currentService {
      acronym
      color
      id
      name
      open
    }
  }
}
`;

export const GET_ONE_USER = gql`
query GetOneUser($getOneUserId: Int!) {
  getOneUser(id: $getOneUserId) {
    id
    firstname
    lastname
    role
    email
    isFirstLogin  
    counter {
      id
      name
    }
    services {
      id
      name
      color
      acronym
      open
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
    currentService {
      acronym
      color
      id
      name
      open
    }
  }
}
`;
