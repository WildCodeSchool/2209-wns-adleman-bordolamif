import { ApolloError } from 'apollo-server-errors';
import Counter from '../entity/Counter';
import CounterModel from '../models/CounterModel';
import TicketModel from '../models/TicketModel';
import UserModel from '../models/UserModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import { CounterInput } from '../utils/types/InputTypes';

const CounterController = {
  getAllCounters: async (): Promise<Counter[]> => await CounterModel.getAllCounters(),

  getOneCounterById: async (id: number): Promise<Counter> => {
    const counter = await CounterModel.getOneCounterById(id);
    if (counter === null) throw new ApolloError('Counter not found', 'NOT_FOUND');
    return counter;
  },

  createCounter: async (data: CounterInput): Promise<Counter> => {
    const waitingRoom = await WaitingRoomModel.getOneArgWaitingRoom(data.waitingRoom.id);
    if (waitingRoom === null) { throw new ApolloError('Waiting room not found', 'NOT_FOUND'); }
    return await CounterModel.createCounter({ name: data.name, waitingRoom });
  },

  deleteCounter: async (id:number): Promise<boolean> => {
    const { affected } = await CounterModel.deleteCounter(id);

    if (affected === 0) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }
    return true;
  },

  updateCounter: async (data:CounterInput, id:number): Promise<Counter> => {
    const counterToUpdate = await CounterModel.getOneCounterById(id);
    if (counterToUpdate === null) { throw new ApolloError('Counter not found', 'NOT_FOUND'); }

    counterToUpdate.name = data.name;

    if (data.user) {
      counterToUpdate.user = await UserModel.getOneArgUser(data.user.id);
      if (counterToUpdate.user === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }
    } else {
      counterToUpdate.user = data.user;
    }

    if (data.ticket) {
      counterToUpdate.ticket = await TicketModel.getOneArgTicket(data.ticket.id);
      if (counterToUpdate.ticket === null) { throw new ApolloError('Ticket not found', 'NOT_FOUND'); }
    } else {
      counterToUpdate.ticket = data.ticket;
    }

    return await CounterModel.updateCounter(counterToUpdate);
  },
};

export default CounterController;
