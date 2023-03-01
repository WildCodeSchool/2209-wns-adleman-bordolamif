import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Counter from '../entity/Counter';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import { CounterInput } from '../utils/types/InputTypes';
import WaitingRoom from '../entity/WaitingRoom';
import User from '../entity/User';
import Ticket from '../entity/Ticket';

@Resolver(Counter)
export class CounterResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [Counter])
  async getAllCounters(): Promise<Counter[]> {
    return await dataSource.getRepository(Counter).find({
      relations: {
        waitingRoom: true,
        user: true,
        ticket: true,
      },
    });
  }

  @Query(() => Counter)
    async getOneCounter(
        @Arg('id', () => Int) id: number,
    ): Promise<Counter> {
      const counter = await dataSource
        .getRepository(Counter)
        .findOne({
          where: { id },
          relations: {
            waitingRoom: true,
            user: true,
            ticket: true,
          },
        });
      if (counter === null) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }
      return counter;
    }
    /** ***********************************
     MUTATION
     ************************************ */

    @Mutation(() => Counter)
  async createCounter(@Arg('data') data: CounterInput): Promise<Counter> {
    const waitingRoom = await dataSource.getRepository(WaitingRoom)
      .findOneOrFail({ where: { id: data.waitingRoom.id } });
    if (waitingRoom === null) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }
    return await dataSource.getRepository(Counter).save({ name: data.name, waitingRoom });
  }

    @Mutation(() => Boolean)
    async deleteCounter(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      const { affected } = await dataSource
        .getRepository(Counter)
        .delete(id);
      if (affected === 0) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }
      return true;
    }

  @Mutation(() => Counter)
    async updateCounter(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: CounterInput,
    ): Promise<Counter> {
      const counterToUpdate = await dataSource.getRepository(Counter).findOne({
        where: { id }, relations: { waitingRoom: true, user: true, ticket: true },
      });

      if (counterToUpdate === null) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }

      counterToUpdate.name = data.name;

      if (data.user) {
        counterToUpdate.user = await dataSource.getRepository(User)
          .findOneOrFail({ where: { id: data.user?.id } });
        if (counterToUpdate.user === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }
      } else {
        counterToUpdate.user = data.user;
      }

      if (data.ticket) {
        counterToUpdate.ticket = await dataSource.getRepository(Ticket)
          .findOneOrFail({ where: { id: data.ticket?.id } });
        if (counterToUpdate.ticket === null) { throw new ApolloError('Ticket not found', 'NOT_FOUND'); }
      } else {
        counterToUpdate.ticket = data.ticket;
      }

      await dataSource.getRepository(Counter).save(counterToUpdate);
      return counterToUpdate;
    }
}
