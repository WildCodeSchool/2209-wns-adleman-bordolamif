import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import { ApolloError } from 'apollo-server-errors';
import WaitingRoom from '../entity/WaitingRoom';
import dataSource from '../db';
import { WaitingRoomInput } from '../utils/types/InputTypes';
import Service from '../entity/Service';
import Counter from '../entity/Counter';

@Resolver(WaitingRoom)
export class WaitingRoomResolver {
  /** ***********************************
                    QUERY
     ************************************ */

    @Query(() => [WaitingRoom])
  async getAllWaitingRooms(): Promise<WaitingRoom[]> {
    return await dataSource.getRepository(WaitingRoom)
      .find({ relations: { services: true, counters: true } });
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
            services: true,
            counters: true,
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
      const waitingRoomServices = await Promise.all(data.services?.map(
        (service) => dataSource.getRepository(Service).findOneOrFail({ where: { id: service.id } }),
      ) || []);
      return await dataSource.getRepository(WaitingRoom)
        .save({ ...data, services: waitingRoomServices });
    }

    // @Authorized<Role>(['admin'])
    @Mutation(() => Boolean)
    async deleteWaitingRoom(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      const waitingRoomToDelete = await dataSource.getRepository(WaitingRoom).findOne({
        where: { id }, relations: { services: true, counters: true },
      });
      if (waitingRoomToDelete === null) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }

      if (waitingRoomToDelete!.counters && waitingRoomToDelete?.counters.length !== 0) {
        waitingRoomToDelete!.counters.map(async (counter) => await dataSource
          .getRepository(Counter)
          .delete(counter.id));
      }

      if (waitingRoomToDelete!.services && waitingRoomToDelete?.services.length !== 0) {
        await dataSource
          .getRepository(WaitingRoom)
          .save({ ...waitingRoomToDelete, services: [] });
      }

      await dataSource.getRepository(WaitingRoom).delete(id);
      return true;
    }

    // @Authorized<Role>(['admin'])
    @Mutation(() => WaitingRoom)
    async updateWaitingRoom(
        @Arg('id', () => Int) id: number,
        @Arg('data') data: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      const { name, services } = data;
      const waitingRoomToUpdate = await dataSource.getRepository(WaitingRoom).findOne({
        where: { id }, relations: { services: true, counters: true },
      });

      if (waitingRoomToUpdate === null) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }

      waitingRoomToUpdate.name = name;
      waitingRoomToUpdate.services = await Promise.all(services?.map(
        (service) => dataSource.getRepository(Service).findOneOrFail({ where: { id: service.id } }),
      ) || []);

      await dataSource.getRepository(WaitingRoom).save(waitingRoomToUpdate);

      return waitingRoomToUpdate;
    }
}
