import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Ticket from '../entity/Ticket';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import { TicketInput } from '../utils/types/InputTypes';
import User from '../entity/User';
import Service from '../entity/Service';
import { Raw } from 'typeorm';

@Resolver(Ticket)
export class TicketResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [Ticket])
  async getAllTickets(): Promise<Ticket[]> {
    return await dataSource.getRepository(Ticket).find({
      relations: {
        service: true,
        user: true,
      },
    });
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
        calledAt, closedAt, isFirstTime, isReturned,
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
        calledAt,
        closedAt,
        isFirstTime,
        isReturned,
        user,
        service: ticketService,
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
        calledAt, closedAt, isReturned, isFirstTime, user, service,
      } = data;
      const ticketToUpdate = await dataSource
        .getRepository(Ticket)
        .findOne({
          where: { id },
          relations: {
            service: true,
            user: true,
          },
        });

      if (ticketToUpdate === null) { throw new ApolloError('Ticket not found', 'NOT_FOUND'); }

      ticketToUpdate.calledAt = calledAt;
      ticketToUpdate.closedAt = closedAt;
      ticketToUpdate.isReturned = isReturned;
      ticketToUpdate.isFirstTime = isFirstTime;
      ticketToUpdate.user = await dataSource.getRepository(User)
        .findOneOrFail({ where: { id: user?.id } }) || null;
      ticketToUpdate.service = await dataSource.getRepository(Service)
        .findOneOrFail({ where: { id: service.id } }) || null;

      await dataSource.getRepository(Ticket).save(ticketToUpdate);

      return ticketToUpdate;
    }
}
