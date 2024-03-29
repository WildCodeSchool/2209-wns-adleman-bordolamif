import {
  Arg, Authorized, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Service from '../entity/Service';
import { ServiceInput } from '../utils/types/InputTypes';
import ServiceController from '../controllers/ServiceController';
import { RoleEnum } from '../utils/enums/RoleEnum';

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
    return await ServiceController.getAllServices();
  }

  @Query(() => Service)
  async getOneService(@Arg('id', () => Int) id: number): Promise<Service> {
    return await ServiceController.getOneServiceById(id);
  }

  @Query(() => [Service])
  async getServicesByWaitingRoomId(@Arg('id', () => Int) id: number): Promise<Service[]> {
    return await ServiceController.getServicesByWaitingRoomId(id);
  }

  /** ***********************************
                  MUTATION
   ************************************ */

  @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
  @Mutation(() => Service)
  async createService(@Arg('data') data: ServiceInput): Promise<Service> {
    return await ServiceController.createService(data);
  }

  @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR])
  @Mutation(() => Boolean)
  async deleteService(@Arg('id', () => Int) id: number): Promise<boolean> {
    return await ServiceController.deleteService(id);
  }

  @Authorized<RoleEnum>([RoleEnum.ADMINISTRATEUR, RoleEnum.OPERATEUR])
  @Mutation(() => Service)
  async updateService(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: ServiceInput,
  ): Promise<Service> {
    return await ServiceController.updateService(data, id);
  }
}
