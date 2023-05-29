import {
  Arg, Authorized, Int, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription,
} from 'type-graphql';
import Ticket from '../entity/Ticket';
import { PartialTicketInput, StartEndDate, TicketInput } from '../utils/types/InputTypes';
import TicketController from '../controllers/TicketController';
import { RoleEnum } from '../utils/enums/RoleEnum';

import { DailyStatistics } from '../utils/types/StatisticsType';

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
  async getAllTicketsBetweenTwoDates(
    @Arg('data') data: StartEndDate,
  ): Promise<Ticket[]> {
    return await TicketController.getAllTicketsBetweenTwoDates(data);
  }

  @Query(() => [DailyStatistics])
  async getLastYearStatistics(): Promise<DailyStatistics[]> {
    return await TicketController.getLastYearStatistics();
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
  async createTicket(
    @Arg('data') data: TicketInput,
    @PubSub() pubsub: PubSubEngine,
  ): Promise<Ticket> {
    const ticket = await TicketController.createTicket(data);
    await pubsub.publish('NewTicket', ticket);
    return ticket;
  }

  @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
  @Mutation(() => Boolean)
  async deleteTicket(@Arg('id', () => Int) id: number): Promise<boolean> {
    return await TicketController.deleteTicket(id);
  }

  @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR, RoleEnum.OPERATEUR])
  @Mutation(() => Ticket)
  async updateTicket(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: TicketInput,
    @PubSub() pubsub: PubSubEngine,
  ): Promise<Ticket> {
    const updatedTicket = await TicketController.updateTicket(data, id);
    await pubsub.publish('UpdatedTicket', updatedTicket);
    return updatedTicket;
  }

  @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR, RoleEnum.OPERATEUR])
  @Mutation(() => Ticket)
  async partialTicketUpdate(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: PartialTicketInput,
      @PubSub() pubsub: PubSubEngine,
  ): Promise<Ticket> {
    const updatedTicket = await TicketController.partialTicketUpdate(data, id);
    await pubsub.publish('UpdatedTicket', updatedTicket);
    return updatedTicket;
  }

  @Mutation(() => Boolean)
  async sendNotification(
      @Arg('id', () => Int) id: number,
  ): Promise<boolean> {
    const ticketToCall = await TicketController.sendNotification(id);
    return ticketToCall;
  }

  /** ***********************************
   SUBSCRIPTION
   ************************************ */

  @Subscription({ topics: 'NewTicket' })
  newTicket(@Root() newTicketPayload: Ticket): Ticket {
    return newTicketPayload;
  }

  @Subscription({ topics: 'UpdatedTicket' })
  updatedTicket(@Root() updatedTicketPayload: Ticket): Ticket {
    return updatedTicketPayload;
  }
}
