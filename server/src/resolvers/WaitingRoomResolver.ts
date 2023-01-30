import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import { ApolloError } from 'apollo-server-errors';
import WaitingRoom from '../entity/WaitingRoom';
import dataSource from '../db';
import { WaitingRoomInput } from '../types/InputTypes';

@Resolver(WaitingRoom)
export class WaitingRoomResolver {
  /** ***********************************
                    QUERY
     ************************************ */

    @Query(() => [WaitingRoom])
  async getAllWaitingRooms(): Promise<WaitingRoom[]> {
    return await dataSource.getRepository(WaitingRoom).find();
  }

    @Query(() => WaitingRoom)
    async getOneWaitingRoom(
        @Arg('id', () => Int) id: number,
    ): Promise<WaitingRoom> {
      const waitingRoom = await dataSource
        .getRepository(WaitingRoom)
        .findOne({
          where: { id },
          relations: {
            service: true,
            counter: true,
          },
        });
      if (waitingRoom === null) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }
      return waitingRoom;
    }

    /** ***********************************
                   MUTATION
     ************************************ */

    // @Authorized<Role>(['admin'])
    @Mutation(() => WaitingRoom)
    async createWaitingRoom(
        @Arg('data') data: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      return await dataSource.getRepository(WaitingRoom).save(data);
    }

    // @Authorized<Role>(['admin'])
    @Mutation(() => Boolean)
    async deleteWaitingRoom(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      const { affected } = await dataSource
        .getRepository(WaitingRoom)
        .delete(id);
      if (affected === 0) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }
      return true;
    }

    // @Authorized<Role>(['admin'])
    @Mutation(() => WaitingRoom)
    async updtateWaitingRoom(
        @Arg('id', () => Int) id: number,
        @Arg('data') { name }: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      const { affected } = await dataSource
        .getRepository(WaitingRoom)
        .update(id, { name });

      if (affected === 0) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }

      return { id, name };
    }
}
