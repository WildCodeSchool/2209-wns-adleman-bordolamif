import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($data: UserConnexion!) {
    login(data: $data)
  }
`;

export const LOGOUT = gql`
  mutation logout($logoutId: Int!) {
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
      currentService {
        id
        name
        isOpen
        color
        acronym
      }
    }
  }
`;

export const UPDATE_USER_SUSPENSION = gql`
  mutation Mutation($data: Boolean!, $updateUserSuspensionId: Int!) {
    updateUserSuspension(data: $data, id: $updateUserSuspensionId) {
      id
      firstname
      lastname
      email
      role
      isSuspended
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: Int!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation FirstLoginPassword($data: FirstUserLoginPassword!) {
    firstLoginPassword(data: $data) {
      email
      isFirstLogin
    }
  }
`;

export const RESET_PASSWORD = gql`
mutation ResetPassword($password: String!, $uuid: String!) {
  resetPassword(password: $password, uuid: $uuid)
}`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($data: UserUpdatePassword!) {
    updatePassword(data: $data) {
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
      currentService {
        id
        name
        isOpen
        color
        acronym
      }
    }
  }
`;
