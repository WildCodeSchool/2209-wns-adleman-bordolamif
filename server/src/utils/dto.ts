import Counter from '../entity/Counter';
import Service from '../entity/Service';
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
