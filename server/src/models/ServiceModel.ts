import { In } from 'typeorm';
import dataSource from '../db';
import Service from '../entity/Service';
import { NewServiceDto } from '../utils/dto';
import { ServiceId } from '../utils/types/InputIdTypes';

const ServiceModel = {
  getAllServices: async () => await dataSource.getRepository(Service)
    .find({
      relations: {
        waitingRoom: true, tickets: true, users: true, currentUsers: true,
      },
    }),

  getMultipleServicesByIds: async (services:ServiceId[]) => await dataSource.getRepository(Service)
    .findBy({ id: In(services.map((service) => service.id)) }),

  getServicesByWaitingRoomId: async (id: number) => await dataSource.getRepository(Service)
    .find({
      where: { waitingRoom: { id } },
      relations: {
        waitingRoom: true, tickets: true, users: true, currentUsers: true,
      },
    }),

  getOneServiceById: async (id: number) => await dataSource
    .getRepository(Service)
    .findOne({
      where: { id },
      relations: {
        waitingRoom: true, tickets: true, users: true, currentUsers: true,
      },
    }),

  getOneServiceByCurrentUserId: async (id: number) => await dataSource.getRepository(Service)
    .findOneOrFail({
      where: { currentUsers: { id } },
      relations: {
        waitingRoom: true, tickets: true, users: true, currentUsers: true,
      },
    }),

  getOneArgService: async (id: number) => await dataSource.getRepository(Service)
    .findOneOrFail({
      where: { id },
    }),

  createService: async (serviceToCreate: NewServiceDto) => await
  dataSource.getRepository(Service).save(serviceToCreate),

  deleteService: async (id: number) => await dataSource.getRepository(Service).delete(id),

  updateService: async (serviceToUpdate: Service) => await
  dataSource.getRepository(Service).save(serviceToUpdate),
};

export default ServiceModel;
