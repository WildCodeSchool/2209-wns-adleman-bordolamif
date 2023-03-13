import Counter from '../entity/Counter';
import dataSource from '../db';
import { CounterId } from '../utils/types/InputIdTypes';

const CounterModel = {
  updateCounter: async (counter:CounterId) => await dataSource.getRepository(Counter)
    .findOneOrFail({ where: { id: counter?.id } }),

  deleteCounter: async (id: number) => await
  dataSource.getRepository(Counter)
    .delete(id),
};

export default CounterModel;
