import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Ticket, { TicketInput } from '../entity/Ticket';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';

@Resolver(Ticket)
export class TicketResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [Ticket])
  async getAllTickets(): Promise<Ticket[]> {
    return await dataSource.getRepository(Ticket).find();
  }

    @Query(() => Ticket)
    async getOneTicket(@Arg('id', () => Int) id: number): Promise<Ticket> {
      const ticket = await dataSource
        .getRepository(Ticket)
        .findOne({ where: { id } });
      if (ticket === null) throw new ApolloError('Ticket not found', 'NOT_FOUND');
      return ticket;
    }

    /** ***********************************
     MUTATION
     ************************************ */

    @Mutation(() => Ticket)
    async createTicket(@Arg('data') data: TicketInput): Promise<Ticket> {
      return await dataSource.getRepository(Ticket).save(data);
    }
}
