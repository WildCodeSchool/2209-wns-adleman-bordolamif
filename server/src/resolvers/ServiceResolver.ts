import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Service, { ServiceInput } from '../entity/Service';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';

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
    return await dataSource.getRepository(Service).find();
  }

  @Query(() => Service)
  async getOneService(@Arg('id', () => Int) id: number): Promise<Service> {
    const service = await dataSource
      .getRepository(Service)
      .findOne({ where: { id } });
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
    return await dataSource.getRepository(Service).save(data);
  }

  @Mutation(() => Service)
  async updateService(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: ServiceInput,
  ): Promise<Service> {
    // if (!isDataValid) {
    //   throw new ApolloError('wrong credentials', 'BAD_USER_INPUT');
    // }

    const serviceToUpdate = await dataSource
      .getRepository(Service)
      .findOne({ where: { id } });

    if (serviceToUpdate === null) {
      throw new ApolloError('service not found', 'NOT_FOUND');
    }

    return await dataSource.getRepository(Service).save(data);
  }

  // @Authorized<Role>(["admin"])
  @Mutation(() => Boolean)
  async deleteService(@Arg('id', () => Int) id: number): Promise<boolean> {
    const serviceToDelete = await dataSource
      .getRepository(Service)
      .findOne({ where: { id } });

    if (serviceToDelete === null) {
      throw new ApolloError('service not found', 'NOT_FOUND');
    }
    await dataSource.getRepository(Service).delete(id);
    return true;
  }
}
