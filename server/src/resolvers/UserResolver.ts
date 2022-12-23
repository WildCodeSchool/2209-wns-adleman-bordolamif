import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import User, { UserInput } from '../entity/User';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';

@Resolver(User)
export class UserResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await dataSource.getRepository(User).find();
  }

  @Query(() => User)
    async getUserById(@Arg('id', () => Int) id: number): Promise<User> {
      const user = await dataSource
        .getRepository(User)
        .findOne({ where: { id } });

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
      firstname, lastname, email, password, role,
    } = data;
    const UserToUpdate = await dataSource.getRepository(User).findOne({
      where: { id },
    });

    if (UserToUpdate === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }

    UserToUpdate.firstname = firstname;
    UserToUpdate.lastname = lastname;
    UserToUpdate.email = email;
    UserToUpdate.password = password;
    UserToUpdate.role = role;

    await dataSource.getRepository(User).save(UserToUpdate);

    return UserToUpdate;
  }
}
