import { gql } from '@apollo/client';

export const CREATE_TICKET = gql`
    mutation CreateTicket($data: TicketInput!) {
        createTicket(data: $data) {
            id
            name
            createdAt
            calledAt
            closedAt
            isFirstTime
            isReturned
            status
            mobileToken
            user {
                id
                firstname
                lastname
                email
                role
            }
            service {
                id
                name
                isOpen
                color
                acronym
            }
        }
    }
`;
