import { StatusEnum } from '../../utils/enum/StatusEnum';
import { RoleEnum } from '../../utils/enum/RoleEnum';

export interface UserProfile {
    id: number;
    email: string;
    role: RoleEnum
    firstname: string;
    lastname: string;
    isFirstLogin: boolean;
    isSuspended: boolean;
}

export interface WaitingRoom {
    id: number;
    name: string;
}

export interface Counter {
    id: number;
    name: string;
}

export interface Service {
    __typename: string,
    acronym: string,
    color: string,
    id: number,
    name: string,
    isOpen: boolean,
    tickets: [
        {
            __typename: string,
            id: number,
            status: number,
        }
    ]
}

export interface Ticket {
    id: number;
    name: string;
    createdAt: string;
    calledAt: string;
    closedAt: string;
    isFirstTime: boolean;
    isReturned: boolean;
    status: StatusEnum;
}

export interface ServicesByWaitingRoom {
    getServicesByWaitingRoomId: [ Service ]
}

export interface TicketData extends Ticket {
    __typename: string;
    service: Service
    user: UserProfile
    counter: Counter
}
