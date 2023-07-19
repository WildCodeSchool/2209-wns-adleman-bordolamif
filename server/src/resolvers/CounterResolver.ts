import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Counter from '../entity/Counter';
import { CounterInput } from '../utils/types/InputTypes';
import CounterModel from '../models/CounterModel';
import CounterController from '../controllers/CounterController';

@Resolver(Counter)
export class CounterResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [Counter])
  async getAllCounters(): Promise<Counter[]> {
    return await CounterModel.getAllCounters();
  }

  @Query(() => Counter)
    async getOneCounter(
        @Arg('id', () => Int) id: number,
    ): Promise<Counter> {
      return await CounterController.getOneCounterById(id);
    }
    /** ***********************************
     MUTATION
     ************************************ */

    @Mutation(() => Counter)
  async createCounter(@Arg('data') data: CounterInput): Promise<Counter> {
    return await CounterController.createCounter(data);
  }

    @Mutation(() => Boolean)
    async deleteCounter(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      return await CounterController.deleteCounter(id);
    }

  @Mutation(() => Counter)
    async updateCounter(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: CounterInput,
    ): Promise<Counter> {
      return await CounterController.updateCounter(data, id);
    }
}
