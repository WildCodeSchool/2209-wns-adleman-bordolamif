import dataSource from '../db';
import { NewWaitingRoomDto } from '../utils/dto';
import WaitingRoom from '../entity/WaitingRoom';

const WaitingRoomModel = {
  getAllWaitingRooms: async () => await dataSource.getRepository(WaitingRoom)
    .find({ relations: { services: true, counters: true } }),

  getOneWaitingRoomById: async (id:number) => await dataSource
    .getRepository(WaitingRoom)
    .findOne({
      where: { id },
      relations: {
        services: true,
        counters: true,
      },
    }),

  createWaitingRoom: async (waitingRoomToCreate: NewWaitingRoomDto) => await
  dataSource.getRepository(WaitingRoom).save(waitingRoomToCreate),

  updateWaitingRoom: async (waitingRoomToUpdate: WaitingRoom) => await dataSource
    .getRepository(WaitingRoom)
    .save(waitingRoomToUpdate),

  deleteWaitingRoom: async (id: number) => await dataSource.getRepository(WaitingRoom).delete(id),
};

export default WaitingRoomModel;
