import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation login($data: UserConnexion!) {
        login(data: $data)
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation logout {
        logout
    }
`;
