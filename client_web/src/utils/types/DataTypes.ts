import { RoleEnum } from '@utils/enum/RoleEnum';
import { StatusEnum } from '@utils/enum/StatusEnum';

export interface UserProfile {
    id: number;
    email: string;
    role: RoleEnum
    firstname: string;
    lastname: string;
    isFirstLogin: boolean;
    isSuspended: boolean;
  }

export interface CurrentUser {
    profile: UserProfile;
  }

export interface UserCounter {
    id: number;
    name: string;
  }

export interface WaitingRoom {
    id: number;
    name: string;
  }
export interface Service {
  id : number;
  name : string;
  color : string;
  acronym : string;
  isOpen : boolean;
}

export interface Ticket {
  id : number;
  name : string;
  createdAt : string;
  calledAt : string;
  closedAt : string;
  isFirstTime : boolean;
  isReturned : boolean;
  status : StatusEnum
}
export interface ServiceData extends Service {
    __typename: string;
    waitingRoom: WaitingRoom
    tickets: Ticket[];
  }

export interface Counter {
    id: number;
    name: string;
  }
export interface CounterData extends Counter {
    __typename: string;
    user: UserProfile;
    waitingRoom: WaitingRoom;
    ticket: Ticket
  }

export interface UserData extends UserProfile{
  __typename: string;
  counter: CounterData | null;
  services: ServiceData[] | null;
  tickets: Ticket[];
  currentService?: Service | null

  }

export interface WaitingRoomData extends WaitingRoom {
    __typename: string;
    services: Service[];
    counters: Counter[]
  }

export interface TicketData extends Ticket {
    __typename: string;
    service: Service
    user: UserProfile
    counter: Counter
  }
