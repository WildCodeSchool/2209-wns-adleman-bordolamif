import { Between, Raw } from 'typeorm';
import dataSource from '../db';
import Ticket from '../entity/Ticket';
import { endOfDay, startOfDay } from '../utils/builders/date';
import { NewTicketDto } from '../utils/dto';
import { SearchCriterias, SearchFilter } from '../utils/interfaces';

const TicketModel = {
  getAllTickets: async (searchFilter?: SearchFilter) => await
  dataSource.getRepository(Ticket).find({
    where: { createdAt: searchFilter?.where?.createdAt },
    relations: {
      service: true,
      user: true,
      counter: true,
    },
  }),

  getAllTicketsForWaitingRoom: async (searchCriterias: SearchCriterias) => await
  dataSource.getRepository(Ticket).find({
    where: searchCriterias,
  }),

  getOneTicketById: async (id: number) => await
  dataSource.getRepository(Ticket).findOne({
    where: { id },
    relations: {
      service: true,
      user: true,
      counter: true,
    },
  }),

  getOneArgTicket: async (id: number) => await dataSource.getRepository(Ticket)
    .findOneOrFail({ where: { id } }),

  getTodayTicketsByService: async (serviceId: number) => await dataSource.getRepository(Ticket)
    .find({ where: { createdAt: Between(startOfDay, endOfDay), service: { id: serviceId } }, order: { createdAt: 'DESC' } }),

  getTodayUntreatedTicketsByServices: async (searchFilter: any) => await
  dataSource.getRepository(Ticket)
    .find(searchFilter),

  createTicket: async (ticketToCreate: NewTicketDto) => await
  dataSource.getRepository(Ticket).save(ticketToCreate),

  deleteTicket: async (id: number) => await dataSource.getRepository(Ticket).delete(id),

  updateTicket: async (ticketToUpdate: Ticket) => await
  dataSource.getRepository(Ticket).save(ticketToUpdate),
};

export default TicketModel;
