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
mutation createUser($data: UserInput!) {
  createUser(data: $data) {
    firstname
    lastname
    email
  }
}
`;
