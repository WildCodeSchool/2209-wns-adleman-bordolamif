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
