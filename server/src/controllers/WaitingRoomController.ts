import WaitingRoom from '../entity/WaitingRoom';
import CounterModel from '../models/CounterModel';
import ServiceModel from '../models/ServiceModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import { WaitingRoomInput } from '../utils/types/InputTypes';

const WaitingRoomController = {
  getAllWaitingRooms:
  async (): Promise<WaitingRoom[]> => await WaitingRoomModel.getAllWaitingRooms(),

  getOneWaitingRoom: async (id: number): Promise<WaitingRoom> => {
    const waitingRoom = await WaitingRoomModel.getOneWaitingRoomById(id);
    if (waitingRoom === null) throw new Error('WaitingRoom not found');
    return waitingRoom;
  },

  createWaitingRoom: async (data: WaitingRoomInput): Promise<WaitingRoom> => {
    const waitingRoomServices = await Promise.all(data.services?.map(
      (service) => ServiceModel.getOneArgService(service.id),
    ) || []);

    return await WaitingRoomModel.createWaitingRoom({
      ...data, services: waitingRoomServices,
    });
  },

  updateWaitingRoom: async (data: WaitingRoomInput, id:number) => {
    const { name, services } = data;

    const waitingRoomToUpdate = await WaitingRoomModel.getOneWaitingRoomById(id);

    if (waitingRoomToUpdate === null) { throw new Error('User not found'); }

    waitingRoomToUpdate.name = name;
    waitingRoomToUpdate.services = await Promise.all(services?.map(
      (service) => ServiceModel.getOneArgService(service.id),
    ) || []);

    return await WaitingRoomModel.updateWaitingRoom(waitingRoomToUpdate);
  },

  deleteWaitingRoom: async (id: number) => {
    const waitingRoomToDelete = await WaitingRoomModel?.getOneWaitingRoomById(id);

    if (waitingRoomToDelete === null) { throw new Error('Waiting room not found'); }

    if (waitingRoomToDelete!.counters && waitingRoomToDelete?.counters.length !== 0) {
        waitingRoomToDelete!.counters.map(async (counter) => await CounterModel
          .deleteCounter(counter.id));
    }

    if (waitingRoomToDelete!.services && waitingRoomToDelete?.services.length !== 0) {
      await WaitingRoomModel.updateWaitingRoom({ ...waitingRoomToDelete, services: [] });
    }
    await WaitingRoomModel.deleteWaitingRoom(id);
    return true;
  },
};

export default WaitingRoomController;
