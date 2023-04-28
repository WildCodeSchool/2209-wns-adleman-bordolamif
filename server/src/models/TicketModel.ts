import { Between } from 'typeorm';
import dataSource from '../db';
import Ticket from '../entity/Ticket';
import { endOfDay, startOfDay } from '../utils/builders/date';
import { NewTicketDto } from '../utils/dto';
import {
  SearchCriterias,
  SearchFilter,
} from '../utils/interfaces';
import { StartEndDate } from '../utils/types/InputTypes';

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

  getAllTicketsBetweenTwoDates: async (dates: StartEndDate) => {
    const startDate = new Date(dates.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dates.endDate);
    endDate.setHours(23, 59, 59, 999);

    const ticketList = dataSource
      .getRepository(Ticket)
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.service', 'service')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.counter', 'counter')
      .where('ticket.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return ticketList;
  },

  getAllTicketsForWaitingRoom: async (
    searchCriterias: SearchCriterias,
  ) => await dataSource.getRepository(Ticket).find({
    where: searchCriterias,
    relations: {
      service: true,
      user: true,
      counter: true,
    },
    order: { createdAt: 'ASC' },
  }),

  getOneTicketById: async (id: number) => await dataSource.getRepository(Ticket).findOne({
    where: { id },
    relations: {
      service: true,
      user: true,
      counter: true,
    },
  }),

  getOneArgTicket: async (id: number) => await
  dataSource.getRepository(Ticket).findOneOrFail({ where: { id } }),

  getTodayTicketsByService: async (serviceId: number) => await
  dataSource.getRepository(Ticket).find({
    where: {
      createdAt: Between(startOfDay, endOfDay),
      service: { id: serviceId },
    },
    order: { createdAt: 'DESC' },
  }),

  createTicket: async (ticketToCreate: NewTicketDto) => await
  dataSource.getRepository(Ticket).save(ticketToCreate),

  deleteTicket: async (id: number) => await dataSource.getRepository(Ticket).delete(id),

  updateTicket: async (ticketToUpdate: Ticket) => await
  dataSource.getRepository(Ticket).save(ticketToUpdate),
};

export default TicketModel;
