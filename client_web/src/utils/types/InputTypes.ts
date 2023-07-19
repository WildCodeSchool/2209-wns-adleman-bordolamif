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
  services: ServiceId[];
}

export interface CounterInput {
  name: string;
  waitingRoom: WaitingRoomId;
  user?: UserId;
}

export interface ServiceInput {
  name: string;
  acronym: string;
  isOpen: boolean;
  color: string;
  waitingRoom?: WaitingRoomId | null;
}

export interface UserConnexion {
  email: string;
  password: string;
}

export interface ChangePassword {
  newPassword: string;
  checkPassword: string;
}

export interface UpdatePassword {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UserUpdatePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface StartEndDate {
  startDate: string;
  endDate: string;
}

export interface Email {
  email: string;
}
