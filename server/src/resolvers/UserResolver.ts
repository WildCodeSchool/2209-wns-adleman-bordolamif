import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import User from '../entity/User';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import Service from '../entity/Service';
import { UserInput } from '../types/InputTypes';

@Resolver(User)
export class UserResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await dataSource
      .getRepository(User)
      .find({ relations: { services: true } });
  }

  @Query(() => User)
    async getUserById(@Arg('id', () => Int) id: number): Promise<User> {
      const user = await dataSource
        .getRepository(User)
        .findOne({ where: { id }, relations: { services: true } });

      if (user === null) throw new ApolloError('User not found', 'NOT_FOUND');
      return user;
    }

  /** ***********************************
     MUTATION
     ************************************ */

  // @Authorized<RoleEnum>([1])
  @Mutation(() => User)
  async createUser(@Arg('data') data: UserInput): Promise<User> {
    return await dataSource.getRepository(User).save(data);
  }

  // @Authorized<RoleEnum>([1])
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number): Promise<boolean> {
    const { affected } = await dataSource.getRepository(User).delete(id);
    if (affected === 0) throw new ApolloError('User not found', 'NOT_FOUND');
    return true;
  }

  @Mutation(() => User)
  async updateUser(
      @Arg('id', () => Int) id: number,
      @Arg('data') data: UserInput,
  ): Promise<User> {
    const {
      firstname, lastname, email, password, role, services,
    } = data;
    const userToUpdate = await dataSource.getRepository(User).findOne({
      where: { id }, relations: { services: true },
    });

    if (userToUpdate === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }

    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.email = email;
    userToUpdate.password = password;
    userToUpdate.role = role;
    userToUpdate.services = await Promise.all(services?.map(
      (service) => dataSource.getRepository(Service).findOneOrFail({ where: { id: service.id } }),
    ) || []);

    await dataSource.getRepository(User).save(userToUpdate);

    return userToUpdate;
  }
}
