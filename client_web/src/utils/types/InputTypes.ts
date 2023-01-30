import { RoleEnum } from '../enum/roleEnum';

export interface UserInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: RoleEnum
  }

export interface UserConnexion {
    email: string;
    password: string;
  }
