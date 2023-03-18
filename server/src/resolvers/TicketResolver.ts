import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Ticket from '../entity/Ticket';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import { TicketInput } from '../utils/types/InputTypes';
import User from '../entity/User';
import Service from '../entity/Service';
import { Between, Raw } from 'typeorm';
import {
  endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear,
} from '../utils/dates';
import { SearchFilter } from '../utils/interfaces';
import { DateFilterEnum } from '../utils/enums/DateFilterEnum';

@Resolver(Ticket)
export class TicketResolver {
  /** ***********************************
     QUERY
     ************************************ */

     @Query(() => [Ticket])
  async getAllTickets(
       @Arg('filter', { nullable: true }) filter?: string,
  ): Promise<Ticket[]> {
    const searchFilter: SearchFilter = {};

    switch (filter) {
      case DateFilterEnum.TODAY:
        searchFilter.where = { createdAt: Between(startOfDay, endOfDay) };
        searchFilter.relations = ['service', 'user', 'counter'];
        break;
      case DateFilterEnum.THIS_WEEK:
        searchFilter.where = { createdAt: Between(startOfWeek, endOfWeek) };
        searchFilter.relations = ['service', 'user', 'counter'];
        break;
      case DateFilterEnum.THIS_MONTH:
        searchFilter.where = { createdAt: Between(startOfMonth, endOfMonth) };
        searchFilter.relations = ['service', 'user', 'counter'];
        break;
      case DateFilterEnum.THIS_YEAR:
        searchFilter.where = { createdAt: Between(startOfYear, endOfYear) };
        searchFilter.relations = ['service', 'user', 'counter'];
        break;
      default:
        searchFilter.relations = ['service', 'user', 'counter'];
        break;
    }
    return await dataSource.getRepository(Ticket).find(
      searchFilter,
    );
  }

    @Query(() => Ticket)
     async getOneTicket(@Arg('id', () => Int) id: number): Promise<Ticket> {
       const ticket = await dataSource
         .getRepository(Ticket)
         .findOne({
           where: { id },
           relations: {
             service: true,
             user: true,
             counter: true,
           },
         });
       if (ticket === null) throw new ApolloError('Ticket not found', 'NOT_FOUND');
       return ticket;
     }

    /** ***********************************
     MUTATION
     ************************************ */

    @Mutation(() => Ticket)
    async createTicket(@Arg('data') data: TicketInput): Promise<Ticket> {
      const {
        isFirstTime,
      } = data;
      const user = await dataSource.getRepository(User)
        .findOneOrFail({ where: { id: data.user?.id } }) || null;
      const ticketService = await dataSource.getRepository(Service)
        .findOneOrFail({ where: { id: data.service.id } }) || null;
      if (ticketService === null) throw new ApolloError('Service not found', 'NOT_FOUND');

      const prefix = ticketService.acronym;

      const todaysTicketsServices = await dataSource.getRepository(Ticket)
        .find({ where: { createdAt: Raw((alias) => `${alias} > DATE(NOW())`), service: { id: ticketService.id } }, order: { createdAt: 'DESC' } });

      let suffix;
      if (!todaysTicketsServices.length || todaysTicketsServices === undefined || todaysTicketsServices[0].name.substring(4, 7) === '999') {
        suffix = '001';
      } else {
        suffix = (parseInt(todaysTicketsServices[0].name.substring(4, 7), 10) + 1).toString().padStart(3, '0');
      }

      const name = `${prefix}-${suffix}`;

      const ticketToCreate = {
        name,
        isFirstTime,
        user,
        service: ticketService,
        ticket: null,
      };
      return await dataSource.getRepository(Ticket).save(ticketToCreate);
    }

    @Mutation(() => Boolean)
    async deleteTicket(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      const { affected } = await dataSource
        .getRepository(Ticket)
        .delete(id);
      if (affected === 0) { throw new ApolloError('Ticket not found', 'NOT_FOUND'); }
      return true;
    }

    @Mutation(() => Ticket)
    async updateTicket(
        @Arg('id', () => Int) id: number,
        @Arg('data') data : TicketInput,
    ): Promise<Ticket> {
      const {
        status, isFirstTime, user, service,
      } = data;
      const ticketToUpdate = await dataSource
        .getRepository(Ticket)
        .findOne({
          where: { id },
          relations: {
            service: true,
            user: true,
            counter: true,
          },
        });

      if (ticketToUpdate === null) { throw new ApolloError('Ticket not found', 'NOT_FOUND'); }

      switch (status) {
        case 2: {
          ticketToUpdate.isReturned = true;
          ticketToUpdate.status = status;
          break;
        }
        case 3: {
          ticketToUpdate.calledAt = new Date();
          ticketToUpdate.status = status;
          break;
        }
        case 4: {
          ticketToUpdate.closedAt = new Date();
          ticketToUpdate.status = status;
          break;
        }
        default: ticketToUpdate.status = status;
      }

      ticketToUpdate.isFirstTime = isFirstTime;
      ticketToUpdate.user = await dataSource.getRepository(User)
        .findOneOrFail({ where: { id: user?.id } }) || null;
      ticketToUpdate.service = await dataSource.getRepository(Service)
        .findOneOrFail({ where: { id: service.id } }) || null;

      await dataSource.getRepository(Ticket).save(ticketToUpdate);

      return ticketToUpdate;
    }
}
