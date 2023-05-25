import { gql } from '@apollo/client';

export const GET_SERVICES_BY_WAITING_ROOM = gql`
    query GetServicesByWaitingRoomId($id: Int!) {
        getServicesByWaitingRoomId(id: $id) {
            name
            id
            color
            acronym
            isOpen
            tickets {
                id
                status
            }
        }
    }
`;

export const GET_ALL_TICKETS_FOR_SERVICE = gql`
    query GetAllTicketsForService($serviceId: Int!) {
        getAllTicketsForService(serviceId: $serviceId) {
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
