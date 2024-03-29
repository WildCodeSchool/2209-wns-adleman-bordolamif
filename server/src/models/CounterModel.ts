import Counter from '../entity/Counter';
import dataSource from '../db';
import { NewCounterDto } from '../utils/dto';

const CounterModel = {
  getAllCounters: async () => await dataSource.getRepository(Counter).find({
    order: { id: 'ASC' },
    relations:
    {
      waitingRoom: true,
      user: true,
      ticket: true,
    },
  }),

  getOneCounterById: async (id: number) => await dataSource
    .getRepository(Counter)
    .findOne({
      where: { id },
      relations: {
        waitingRoom: true,
        user: true,
        ticket: true,
      },
    }),
  getOneArgCounter: async (id: number) => await dataSource.getRepository(Counter)
    .findOne({ where: { id } }),

  getOneCounterByUserId: async (id: number) => await dataSource.getRepository(Counter)
    .findOne({
      where: { user: { id } },
      relations: {
        waitingRoom: true,
        user: true,
        ticket: true,
      },
    }),

  createCounter: async (data: NewCounterDto) => await
  dataSource.getRepository(Counter).save(data),

  updateCounter: async (counterToUpdate: Counter) => await
  dataSource.getRepository(Counter).save(counterToUpdate),

  deleteCounter: async (id: number) => await
  dataSource.getRepository(Counter)
    .delete(id),
};

export default CounterModel;
