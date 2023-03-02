import { RoleEnum } from '@utils/enum/RoleEnum';
import { StatusEnum } from '@utils/enum/StatusEnum';
import {
  CounterId, ServiceId, UserId, WaitingRoomId,
} from './InputIdTypes';

export interface UserInput {
      firstname: string;
      lastname: string;
      email: string;
      password?: string;
      role?: RoleEnum;
      counter?: CounterId;
      services?: ServiceId[];
      currentService?: ServiceId;
  }

export interface TicketInput {
      name?: string;
      isFirstTime: boolean;
      status?: StatusEnum;
      user?: UserId;
      service: ServiceId;
}

export interface WaitingRoomInput {
      name: string;
      services: ServiceId[]
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
      waitingRoom?: WaitingRoomId | null;
}

export interface UserConnexion {
    email: string;
    password: string;
  }
