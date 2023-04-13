import { Not } from 'typeorm';
import Ticket from '../entity/Ticket';
import ServiceModel from '../models/ServiceModel';
import TicketModel from '../models/TicketModel';
import UserModel from '../models/UserModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import { dateFilterBuilder } from '../utils/builders/date';
import { ticketNameBuilder, ticketStatusUpdater } from '../utils/builders/ticket';
import { DateFilterEnum } from '../utils/enums/DateFilterEnum';
import { StatusEnum } from '../utils/enums/StatusEnum';
import { SearchCriterias } from '../utils/interfaces';
import { TicketInput } from '../utils/types/InputTypes';

const TicketController = {
  getAllTcikets: async (filter?: string): Promise<Ticket[]> => {
    const searchFilter = dateFilterBuilder(filter);
    return await TicketModel.getAllTickets(searchFilter);
  },

  getAllTicketsForWaitingRoom: async (waitingRoomId: number): Promise<Ticket[]> => {
    const waitingRoom = await WaitingRoomModel.getOneWaitingRoomById(waitingRoomId);
    const services = waitingRoom!.services!.map((service) => ({ id: service.id }));
    const dateFilter = dateFilterBuilder(DateFilterEnum.TODAY);
    const searchCriterias : SearchCriterias = {
      service: services,
      status: Not(StatusEnum.TRAITE),
      createdAt: dateFilter?.where?.createdAt,
    };

    return await TicketModel.getAllTicketsForWaitingRoom(searchCriterias);
  },

  getOneTicketById: async (id: number): Promise<Ticket> => {
    const ticket = await TicketController.getOneTicketById(id);
    if (ticket === null) throw new Error('Ticket not found');
    return ticket;
  },

  createTicket: async (data: TicketInput): Promise<Ticket> => {
    const { user, service, isFirstTime } = data;

    const ticketUser = (user && await UserModel.getOneArgUser(user.id)) || undefined;

    const ticketService = await ServiceModel.getOneArgService(service.id) || null;

    if (ticketService === null) throw new Error('Service not found');

    const todaysTicketsServices = await TicketModel.getTodayTicketsByService(ticketService.id);

    const name = ticketNameBuilder(ticketService, todaysTicketsServices);

    const ticketToCreate = {
      name,
      isFirstTime,
      user: ticketUser,
      service: ticketService,
    };
    return await TicketModel.createTicket(ticketToCreate);
  },

  deleteTicket: async (id: number): Promise<boolean> => {
    const { affected } = await TicketModel.deleteTicket(id);
    if (affected === 0) { throw new Error('Ticket not found'); }
    return true;
  },

  updateTicket: async (data: TicketInput, id: number) => {
    const {
      status, isFirstTime, user, service,
    } = data;
    const ticketToUpdate = await TicketModel.getOneTicketById(id);

    if (ticketToUpdate === null) { throw new Error('Ticket not found'); }

    ticketStatusUpdater(ticketToUpdate, status);

    ticketToUpdate.isFirstTime = isFirstTime;
    if (user) {
      ticketToUpdate.user = await UserModel.getOneArgUser(user.id) || null;
    }
    ticketToUpdate.service = await ServiceModel.getOneArgService(service.id) || null;

    await TicketModel.updateTicket(ticketToUpdate);

    return ticketToUpdate;
  },
};

export default TicketController;
