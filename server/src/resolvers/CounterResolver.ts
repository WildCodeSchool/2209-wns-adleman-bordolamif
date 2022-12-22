import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Counter, { CounterInput } from '../entity/Counter';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';

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

    /** ***********************************
     MUTATION
     ************************************ */

    @Mutation(() => Counter)
    async createCounter(@Arg('data') data: CounterInput): Promise<Counter> {
      return await dataSource.getRepository(Counter).save(data);
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
      @Arg('data') { name }: CounterInput,
    ): Promise<Counter> {
      const { affected } = await dataSource
        .getRepository(Counter)
        .update(id, { name });

      if (affected === 0) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }

      return {
        id, name,
      };
    }
}
