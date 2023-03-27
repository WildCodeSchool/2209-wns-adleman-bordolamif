import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import WaitingRoom from '../entity/WaitingRoom';
import { WaitingRoomInput } from '../utils/types/InputTypes';
import WaitingRoomController from '../controllers/WaitingRoomController';

@Resolver(WaitingRoom)
export class WaitingRoomResolver {
  /** ***********************************
                    QUERY
     ************************************ */

    @Query(() => [WaitingRoom])
  async getAllWaitingRooms(): Promise<WaitingRoom[]> {
    return await WaitingRoomController.getAllWaitingRooms();
  }

    @Query(() => WaitingRoom)
    async getOneWaitingRoom(
        @Arg('id', () => Int) id: number,
    ): Promise<WaitingRoom> {
      return await WaitingRoomController.getOneWaitingRoom(id);
    }

    /** ***********************************
                   MUTATION
     ************************************ */

    // @Authorized<Role>(['admin'])
    @Mutation(() => WaitingRoom)
    async createWaitingRoom(
        @Arg('data') data: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      return await WaitingRoomController.createWaitingRoom(data);
    }

    // @Authorized<Role>(['admin'])
    @Mutation(() => Boolean)
    async deleteWaitingRoom(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      return await WaitingRoomController.deleteWaitingRoom(id);
    }

    // @Authorized<Role>(['admin'])
    @Mutation(() => WaitingRoom)
    async updateWaitingRoom(
        @Arg('id', () => Int) id: number,
        @Arg('data') data: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      return await WaitingRoomController.updateWaitingRoom(data, id);
    }
}
