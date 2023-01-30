import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Counter from '../entity/Counter';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import { CounterInput } from '../types/InputTypes';
import WaitingRoom from '../entity/WaitingRoom';
import User from '../entity/User';

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
    async deleteCouter(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      const { affected } = await dataSource
        .getRepository(Counter)
        .delete(id);
      if (affected === 0) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }
      return true;
    }

  @Mutation(() => Counter)
    async updtateCounter(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: CounterInput,
    ): Promise<Counter> {
      const waitingRoom = await dataSource.getRepository(WaitingRoom)
        .findOneOrFail({ where: { id: data.waitingRoom.id } });
      const user = await dataSource.getRepository(User)
        .findOneOrFail({ where: { id: data.user?.id } });
      const { affected } = await dataSource
        .getRepository(Counter)
        .update(id, { name: data.name, waitingRoom, user });

      if (waitingRoom === null) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }
      if (user === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }
      if (affected === 0) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }

      return {
        id, name: data.name, waitingRoom, user,
      };
    }
}
