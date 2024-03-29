import { Not } from 'typeorm';
import Ticket from '../entity/Ticket';
import ServiceModel from '../models/ServiceModel';
import TicketModel from '../models/TicketModel';
import UserModel from '../models/UserModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import {
  dateFilterBuilder, getOneYearAgo, getYesterday,
} from '../utils/builders/date';
import {
  ticketNameBuilder,
  ticketStatusUpdater,
} from '../utils/builders/ticket';
import { DateFilterEnum } from '../utils/enums/DateFilterEnum';
import { StatusEnum } from '../utils/enums/StatusEnum';
import { SearchCriterias } from '../utils/interfaces';
import { PartialTicketInput, StartEndDate, TicketInput } from '../utils/types/InputTypes';
import { Expo } from 'expo-server-sdk';
import { env } from '../env';
import { getDailyStatistics } from '../utils/builders/statistics';
import { DailyStatistics } from '../utils/types/StatisticsType';

const expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });

const TicketController = {
  getAllTcikets: async (filter?: string): Promise<Ticket[]> => {
    const searchFilter = dateFilterBuilder(filter);
    return await TicketModel.getAllTickets(searchFilter);
  },

  getAllTicketsBetweenTwoDates: async (
    dates: StartEndDate,
  ): Promise<Ticket[]> => await TicketModel.getAllTicketsBetweenTwoDates(dates),

  getAllTicketsForWaitingRoom: async (waitingRoomId: number): Promise<Ticket[]> => {
    const waitingRoom = await WaitingRoomModel.getOneWaitingRoomById(waitingRoomId);
    if (waitingRoom === null) throw new Error('Waiting room not found');
    const services = waitingRoom!.services!.map((service) => ({ id: service.id }));
    const dateFilter = dateFilterBuilder(DateFilterEnum.TODAY);
    const searchCriterias: SearchCriterias = {
      service: services,
      status: Not(StatusEnum.TRAITE),
      createdAt: dateFilter?.where?.createdAt,
    };

    return await TicketModel.getAllTicketsForWaitingRoom(searchCriterias);
  },

  getLastYearStatistics: async (): Promise<DailyStatistics[]> => {
    const last365days = {
      startDate: getOneYearAgo().toDateString(),
      endDate: getYesterday().toDateString(),
    };
    const ticketsList = await TicketModel.getAllTicketsBetweenTwoDates(last365days);

    return getDailyStatistics(ticketsList);
  },

  getAllTicketsForService: async (serviceId: number): Promise<Ticket[]> => {
    const service = await ServiceModel.getOneServiceById(serviceId);
    if (service === null) throw new Error('Service not found');
    const dateFilter = dateFilterBuilder(DateFilterEnum.TODAY);
    const searchCriterias: SearchCriterias = {
      service: [{ id: service.id }],
      status: Not(StatusEnum.TRAITE),
      createdAt: dateFilter?.where?.createdAt,
    };

    return await TicketModel.getAllTicketsForService(searchCriterias);
  },

  getOneTicketById: async (id: number): Promise<Ticket> => {
    const ticket = await TicketModel.getOneTicketById(id);
    if (ticket === null) throw new Error('Ticket not found');
    return ticket;
  },

  createTicket: async (data: TicketInput): Promise<Ticket> => {
    const {
      user,
      service,
      isFirstTime,
      mobileToken,
    } = data;

    const ticketUser = (user && (await UserModel.getOneArgUser(user.id))) || undefined;

    const ticketService = (await ServiceModel.getOneArgService(service.id)) || null;

    if (ticketService === null) throw new Error('Service not found');

    const todaysTicketsServices = await TicketModel.getTodayTicketsByService(
      ticketService.id,
    );

    const name = ticketNameBuilder(ticketService, todaysTicketsServices);

    const ticketToCreate = {
      name,
      isFirstTime,
      user: ticketUser,
      service: ticketService,
      mobileToken,
    };
    return await TicketModel.createTicket(ticketToCreate);
  },

  deleteTicket: async (id: number): Promise<boolean> => {
    const { affected } = await TicketModel.deleteTicket(id);
    if (affected === 0) {
      throw new Error('Ticket not found');
    }
    return true;
  },

  updateTicket: async (data: TicketInput, id: number) => {
    const {
      status, isFirstTime, user, service,
    } = data;
    const ticketToUpdate = await TicketModel.getOneTicketById(id);

    if (ticketToUpdate === null) {
      throw new Error('Ticket not found');
    }

    ticketStatusUpdater(ticketToUpdate, status);

    ticketToUpdate.isFirstTime = isFirstTime;
    if (user) {
      ticketToUpdate.user = (await UserModel.getOneArgUser(user.id)) || null;
    }
    ticketToUpdate.service = (await ServiceModel.getOneArgService(service.id)) || null;

    await TicketModel.updateTicket(ticketToUpdate);

    return ticketToUpdate;
  },
  partialTicketUpdate: async (data: PartialTicketInput, id: number) => {
    const ticketToUpdate = await TicketModel.getOneTicketById(id);

    if (ticketToUpdate === null) {
      throw new Error('Ticket not found');
    }

    ticketToUpdate.isFirstTime = data.isFirstTime ?? ticketToUpdate.isFirstTime;
    ticketToUpdate.status = data.status ?? ticketToUpdate.status;

    ticketStatusUpdater(ticketToUpdate, ticketToUpdate.status);

    if (data.user) {
      ticketToUpdate.user = (await UserModel.getOneArgUser(data.user.id)) || null;
    }

    if (data.service) {
      ticketToUpdate.service = (await ServiceModel.getOneArgService(data.service.id)) || null;
    }

    await TicketModel.updateTicket(ticketToUpdate);

    return ticketToUpdate;
  },

  sendNotification: async (id: number) => {
    const ticketToCall = await TicketModel.getOneTicketById(id);
    if (ticketToCall === null) throw new Error('Ticket not found');
    const { mobileToken } = ticketToCall;
    if (mobileToken === null || typeof mobileToken === 'undefined') return true;
    if (!Expo.isExpoPushToken(mobileToken)) throw new Error('Mobile token not found');

    await expo.sendPushNotificationsAsync(
      [{
        to: mobileToken,
        sound: 'default',
        title: '🙌 Votre tour est arrivé ! 🙌',
        body: 'Fini l\'attente !! Revenez sur l\'application pour voir le guichet auquel vous rendre 😉',
      }],
    );

    return true;
  },

};

export default TicketController;
