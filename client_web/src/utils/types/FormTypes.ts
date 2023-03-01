import { ServiceId } from './InputIdTypes';

export interface UserFormDefaultValues {
    firstname: string | null,
      lastname: string | null,
      email: string | null,
      services: ServiceId[] | []
}
