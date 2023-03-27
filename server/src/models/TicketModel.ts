import { Raw } from 'typeorm';
import dataSource from '../db';
import Ticket from '../entity/Ticket';
import { NewTicketDto } from '../utils/dto';
import { SearchFilter } from '../utils/interfaces';

const TicketModel = {
  getAllTickets: async (searchFilter?: SearchFilter) => await
  dataSource.getRepository(Ticket).find(searchFilter),

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
    .find({ where: { createdAt: Raw((alias) => `${alias} > DATE(NOW())`), service: { id: serviceId } }, order: { createdAt: 'DESC' } }),

  createTicket: async (ticketToCreate: NewTicketDto) => await
  dataSource.getRepository(Ticket).save(ticketToCreate),

  deleteTicket: async (id: number) => await dataSource.getRepository(Ticket).delete(id),

  updateTicket: async (ticketToUpdate: Ticket) => await
  dataSource.getRepository(Ticket).save(ticketToUpdate),
};

export default TicketModel;
