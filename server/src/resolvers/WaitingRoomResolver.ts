import {
  Arg, Authorized, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import WaitingRoom from '../entity/WaitingRoom';
import { WaitingRoomInput } from '../utils/types/InputTypes';
import WaitingRoomController from '../controllers/WaitingRoomController';
import { RoleEnum } from '../utils/enums/RoleEnum';

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

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
    @Mutation(() => WaitingRoom)
    async createWaitingRoom(
        @Arg('data') data: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      return await WaitingRoomController.createWaitingRoom(data);
    }

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
    @Mutation(() => Boolean)
    async deleteWaitingRoom(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
      return await WaitingRoomController.deleteWaitingRoom(id);
    }

    @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
    @Mutation(() => WaitingRoom)
    async updateWaitingRoom(
        @Arg('id', () => Int) id: number,
        @Arg('data') data: WaitingRoomInput,
    ): Promise<WaitingRoom> {
      return await WaitingRoomController.updateWaitingRoom(data, id);
    }
}
