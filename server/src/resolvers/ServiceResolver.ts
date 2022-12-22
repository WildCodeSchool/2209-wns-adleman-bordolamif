import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Service, { ServiceInput } from '../entity/Service';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';

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
      if (service === null) throw new ApolloError('Service not found', 'NOT_FOUND');
      return service;
    }

    /** ***********************************
                   MUTATION
     ************************************ */

    @Mutation(() => Service)
    async createService(@Arg('data') data: ServiceInput): Promise<Service> {
      return await dataSource.getRepository(Service).save(data);
    }
}
