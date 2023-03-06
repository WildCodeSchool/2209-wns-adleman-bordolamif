import dataSource from '../db';
import Service from '../entity/Service';
import { ServiceId } from '../utils/types/InputIdTypes';

const ServiceModel = {
  getOneServiceByCurrentUserId: async (id: number) => await dataSource.getRepository(Service)
    .findOneOrFail({
      where: { currentUsers: { id } },
      relations: {
        waitingRoom: true, tickets: true, users: true, currentUsers: true,
      },
    }),

  getOneArgService: async (service: ServiceId) => await dataSource.getRepository(Service)
    .findOneOrFail({
      where: { id: service.id },
    }),

  updateService: async (serviceToUpdate: Service) => await
  dataSource.getRepository(Service).save(serviceToUpdate),
};

export default ServiceModel;
