import { TicketData } from './DataTypes';

export type RootStackParamList = {
    HomeScreen: undefined;
    QrCodeScanner: undefined;
    ServicesSelectionScreen: { waitingRoomId:string };
    TicketScreen: { createdTicket:TicketData };
};
