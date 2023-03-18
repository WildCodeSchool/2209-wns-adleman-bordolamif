import Service from '../entity/Service';
import User from '../entity/User';
import WaitingRoom from '../entity/WaitingRoom';
import { RoleEnum } from './enums/RoleEnum';

export interface NewUserDto{
    firstname: string,
    lastname : string,
    email: string,
    hashedPassword:string,
    role: RoleEnum,
    isFirstLogin: boolean,
    services: Service[],
    counter: null,
}

export interface NewWaitingRoomDto{
    name: string,
    services: Service[],
}

export interface NewServiceDto{
    name:string,
    acronym: string,
    open: boolean,
    color: string,
    waitingRoom: WaitingRoom | undefined
}

export interface NewTicketDto{
    name: string,
    isFirstTime: boolean,
    user: User | undefined,
    service: Service,
  }

export interface NewCounterDto{
    name: string,
    waitingRoom: WaitingRoom
  }
