import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Service from '../entity/Service';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import { ServiceInput } from '../utils/types/InputTypes';
import WaitingRoom from '../entity/WaitingRoom';

// const isDataValid = ()=> {
//   //TODO
// }

@Resolver(Service)
export class ServiceResolver {
  /** ***********************************
                  QUERY
   ************************************ */

  @Query(() => [Service])
  async getAllServices(): Promise<Service[]> {
    return await dataSource.getRepository(Service)
      .find({
        relations: {
          waitingRoom: true, tickets: true, users: true, currentUsers: true,
        },
      });
  }

  @Query(() => Service)
  async getOneService(@Arg('id', () => Int) id: number): Promise<Service> {
    const service = await dataSource
      .getRepository(Service)
      .findOne({
        where: { id },
        relations: {
          waitingRoom: true, tickets: true, users: true, currentUsers: true,
        },
      });
    if (service === null) {
      throw new ApolloError('Service not found', 'NOT_FOUND');
    }
    return service;
  }

  /** ***********************************
                  MUTATION
   ************************************ */

  @Mutation(() => Service)
  async createService(@Arg('data') data: ServiceInput): Promise<Service> {
    let waitingRoom;
    if (data.waitingRoom) {
      waitingRoom = await dataSource.getRepository(WaitingRoom)
        .findOneOrFail({ where: { id: data.waitingRoom?.id } });
    } else waitingRoom = undefined;
    const {
      name, acronym, open, color,
    } = data;
    const serviceToCreate = {
      name, acronym, open, color, waitingRoom,
    };
    return await dataSource.getRepository(Service).save(serviceToCreate);
  }

  @Mutation(() => Boolean)
  async deleteService(@Arg('id', () => Int) id: number): Promise<boolean> {
    const { affected } = await dataSource.getRepository(Service).delete(id);
    if (affected === 0) throw new ApolloError('Service not found', 'NOT_FOUND');
    return true;
  }

  @Mutation(() => Service)
  async updateService(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: ServiceInput,
  ): Promise<Service> {
    const {
      name, acronym, open, color, waitingRoom,
    } = data;
    const ServiceToUpdate = await dataSource.getRepository(Service).findOne({
      where: { id },
    });

    if (ServiceToUpdate === null) { throw new ApolloError('Service not found', 'NOT_FOUND'); }

    ServiceToUpdate.name = name;
    ServiceToUpdate.acronym = acronym;
    ServiceToUpdate.open = open;
    ServiceToUpdate.color = color;

    if (waitingRoom !== null && typeof (waitingRoom) !== 'undefined') {
      ServiceToUpdate.waitingRoom = await dataSource.getRepository(WaitingRoom)
        .findOneOrFail({ where: { id: data.waitingRoom?.id } }) || null;
    } else {
      ServiceToUpdate.waitingRoom = undefined;
    }

    await dataSource.getRepository(Service).save(ServiceToUpdate);

    return ServiceToUpdate;
  }
}
