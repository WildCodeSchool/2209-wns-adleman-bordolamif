import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Ticket from '../entity/Ticket';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import { TicketInput } from '../types/InputTypes';
import User from '../entity/User';
import Service from '../entity/Service';

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
        name, calledAt, closedAt, isFirstTime, isReturned,
      } = data;
      const user = await dataSource.getRepository(User)
        .findOneOrFail({ where: { id: data.user?.id } }) || null;
      const service = await dataSource.getRepository(Service)
        .findOneOrFail({ where: { id: data.service.id } }) || null;
      const ticketToCreate = {
        name, calledAt, closedAt, isFirstTime, isReturned, user, service,
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
    async updtateTicket(
        @Arg('id', () => Int) id: number,
        @Arg('data') data : TicketInput,
    ): Promise<Ticket> {
      const {
        name, calledAt, closedAt, isReturned, isFirstTime, user, service,
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

      ticketToUpdate.name = name;
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
