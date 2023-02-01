import { RoleEnum } from '@utils/enum/RoleEnum';
import {
  CounterId, ServiceId, UserId, WaitingRoomId,
} from './InputIdTypes';

export interface UserInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: RoleEnum;
    counter?: CounterId;
    services?: ServiceId;
  }

export interface TicketInput {
      name: string;
      calledAt?: Date;
      closedAt?: Date;
      isFirstTime: boolean;
      isReturned?: boolean;
      user?: UserId;
      service: ServiceId;
}

export interface WaitingRoomInput {
      name: string;
}

export interface CounterInput {
      name: string;
      waitingRoom: WaitingRoomId;
      user?: UserId;
}

export interface ServiceInput {
      name: string;
      acronym: string;
      open: boolean;
      color: string;
      waitingRoom?: WaitingRoomId;
}

export interface UserConnexion {
    email: string;
    password: string;
  }
