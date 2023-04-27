import { gql } from '@apollo/client';

export const GET_SERVICES_BY_WAITING_ROOM = gql`
    query Query($getServicesByWaitingRoomId: Int!) {
        getServicesByWaitingRoomId(id: $getServicesByWaitingRoomId) {
            name
            id
            color
            acronym
            tickets {
                id
                status
            }
        }
    }
`;
