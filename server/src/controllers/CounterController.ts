import Counter from '../entity/Counter';
import CounterModel from '../models/CounterModel';
import TicketModel from '../models/TicketModel';
import UserModel from '../models/UserModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import { CounterInput, PartialCounterInput } from '../utils/types/InputTypes';

const CounterController = {
  getAllCounters: async (): Promise<Counter[]> => await CounterModel.getAllCounters(),

  getOneCounterById: async (id: number): Promise<Counter> => {
    const counter = await CounterModel.getOneCounterById(id);
    if (counter === null) throw new Error('Counter not found');
    return counter;
  },

  createCounter: async (data: CounterInput): Promise<Counter> => {
    const waitingRoom = await WaitingRoomModel.getOneArgWaitingRoom(data.waitingRoom.id);
    if (waitingRoom === null) { throw new Error('Waiting room not found'); }
    return await CounterModel.createCounter({ name: data.name, waitingRoom });
  },

  deleteCounter: async (id:number): Promise<boolean> => {
    const { affected } = await CounterModel.deleteCounter(id);

    if (affected === 0) { throw new Error('Counter not found'); }
    return true;
  },

  updateCounter: async (data:CounterInput, id:number): Promise<Counter> => {
    const counterToUpdate = await CounterModel.getOneCounterById(id);
    if (counterToUpdate === null) { throw new Error('Counter not found'); }

    counterToUpdate.name = data.name;

    const waitingRoom = await WaitingRoomModel.getOneArgWaitingRoom(data.waitingRoom.id);
    if (waitingRoom === null) { throw new Error('Waiting room not found'); }

    counterToUpdate.waitingRoom = waitingRoom;
    if (data.user) {
      counterToUpdate.user = await UserModel.getOneArgUser(data.user.id);
      if (counterToUpdate.user === null) { throw new Error('User not found'); }
    } else {
      counterToUpdate.user = data.user;
    }

    if (data.ticket) {
      counterToUpdate.ticket = await TicketModel.getOneArgTicket(data.ticket.id);
      if (counterToUpdate.ticket === null) { throw new Error('Ticket not found'); }
    } else {
      counterToUpdate.ticket = data.ticket;
    }

    return await CounterModel.updateCounter(counterToUpdate);
  },

  partialCounterUpdate: async (data:PartialCounterInput, id:number): Promise<Counter> => {
    const counterToUpdate = await CounterModel.getOneCounterById(id);
    if (counterToUpdate === null) { throw new Error('Counter not found'); }

    counterToUpdate.name = data.name ?? counterToUpdate.name;

    if (data.user) {
      counterToUpdate.user = await UserModel.getOneArgUser(data.user.id);
      if (counterToUpdate.user === null) { throw new Error('User not found'); }
    }

    if (data.waitingRoom) {
      counterToUpdate.waitingRoom = await
      WaitingRoomModel.getOneArgWaitingRoom(data.waitingRoom.id);
      if (counterToUpdate.waitingRoom === null) { throw new Error('WaitingRoom not found'); }
    }

    if (data.ticket) {
      if (data.ticket.id === 0) {
        counterToUpdate.ticket = null;
      } else {
        counterToUpdate.ticket = await TicketModel.getOneArgTicket(data.ticket.id);
        if (counterToUpdate.ticket === null) { throw new Error('Ticket not found'); }
      }
    }

    return await CounterModel.updateCounter(counterToUpdate);
  },
};

export default CounterController;
