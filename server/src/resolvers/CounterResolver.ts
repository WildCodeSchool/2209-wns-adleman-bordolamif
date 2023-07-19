import {
  Arg, Authorized, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Counter from '../entity/Counter';
import { CounterInput, PartialCounterInput } from '../utils/types/InputTypes';
import CounterController from '../controllers/CounterController';
import { RoleEnum } from '../utils/enums/RoleEnum';

@Resolver(Counter)
export class CounterResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [Counter])
  async getAllCounters(): Promise<Counter[]> {
    return await CounterController.getAllCounters();
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

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
    @Mutation(() => Counter)
  async createCounter(@Arg('data') data: CounterInput): Promise<Counter> {
    return await CounterController.createCounter(data);
  }

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
    @Mutation(() => Boolean)
    async deleteCounter(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      return await CounterController.deleteCounter(id);
    }

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR, RoleEnum.OPERATEUR])
    @Mutation(() => Counter)
    async updateCounter(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: CounterInput,
    ): Promise<Counter> {
      return await CounterController.updateCounter(data, id);
    }

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR, RoleEnum.OPERATEUR])
    @Mutation(() => Counter)
    async partialCounterUpdate(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: PartialCounterInput,
    ): Promise<Counter> {
      return await CounterController.partialCounterUpdate(data, id);
    }
}
