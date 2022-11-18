import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import WaitingRoom, { WaitingRoomInput } from '../entity/WaitingRoom';
import dataSource from '../db';

@Resolver(WaitingRoom)
export class WaitingRoomResolver {
    /*************************************
                    QUERY
     *************************************/

    @Query(() => [WaitingRoom])
    async getAllWaitingRooms(): Promise<WaitingRoom[]> {
        return await dataSource.getRepository(WaitingRoom).find();
    }
    /*************************************
                   MUTATION
     *************************************/

    @Mutation(() => WaitingRoom)
    async createWaitingRoom(
        @Arg('data') data: WaitingRoomInput
    ): Promise<WaitingRoom> {
        return await dataSource.getRepository(WaitingRoom).save(data);
    }
}
