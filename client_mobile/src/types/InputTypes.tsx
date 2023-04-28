import { ServiceId } from './InputIdTypes';

export interface TicketInput {
    isFirstTime: boolean;
    service: ServiceId;
    mobileToken?: string;
}
