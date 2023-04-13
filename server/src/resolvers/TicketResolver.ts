import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Ticket from '../entity/Ticket';
import { TicketInput } from '../utils/types/InputTypes';
import TicketController from '../controllers/TicketController';

@Resolver(Ticket)
export class TicketResolver {
  /** ***********************************
     QUERY
     ************************************ */

     @Query(() => [Ticket])
  async getAllTickets(
       @Arg('filter', { nullable: true }) filter?: string,
  ): Promise<Ticket[]> {
    return await TicketController.getAllTcikets(filter);
  }

      @Query(() => [Ticket])
     async getAllTicketsForWaitingRoom(
           @Arg('waitingRoomId', () => Int) waitingRoomId: number,
     ): Promise<Ticket[]> {
       return await TicketController.getAllTicketsForWaitingRoom(waitingRoomId);
     }

    @Query(() => Ticket)
      async getOneTicket(@Arg('id', () => Int) id: number): Promise<Ticket> {
        return await TicketController.getOneTicketById(id);
      }

    /** ***********************************
     MUTATION
     ************************************ */

    @Mutation(() => Ticket)
    async createTicket(@Arg('data') data: TicketInput): Promise<Ticket> {
      return await TicketController.createTicket(data);
    }

    @Mutation(() => Boolean)
    async deleteTicket(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      return await TicketController.deleteTicket(id);
    }

    @Mutation(() => Ticket)
    async updateTicket(
        @Arg('id', () => Int) id: number,
        @Arg('data') data : TicketInput,
    ): Promise<Ticket> {
      return await TicketController.updateTicket(data, id);
    }
}
