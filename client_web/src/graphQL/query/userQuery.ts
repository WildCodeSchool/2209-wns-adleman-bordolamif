import { gql } from '@apollo/client';

export const PROFILE = gql`
query getProfile {
  profile{
    id
    email
    role
    firstname
    lastname
  }
}
`;
