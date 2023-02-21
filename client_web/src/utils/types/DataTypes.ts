import { RoleEnum } from '@utils/enum/RoleEnum';

export interface UserProfile {
    id: number;
    email: string;
    role: RoleEnum
    firstname: string;
    lastname: string;
  }

export interface CurrentUser {
    profile: UserProfile;
  }

export interface UserCounter {
    id: number;
    name: string;
  }
export interface Service {
  id : number;
  name : string;
  color : string;
  acronym : string;
  open : boolean;
}

export interface Ticket {
  id : number;
  name : string;
  createdAt : string;
  calledAt : string;
  closedAt : string;
  isFirstTime : boolean;
  isReturned : boolean;
}

export interface UserData extends UserProfile{
  __typename: string;
  counter: UserCounter;
  services: Service[];
  tickets: Ticket[];

  }
