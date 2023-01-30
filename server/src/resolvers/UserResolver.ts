import {
  Arg, Authorized, Ctx, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import User, {
  getSafeAttributes, hashPassword, verifyPassword,
} from '../entity/User';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';
import { env, loadEnv } from '../env';
import { ContextType } from '../utils/interfaces';
import { UserConnexion, UserInput } from '../utils/types/InputTypes';
import Service from '../entity/Service';
import Counter from '../entity/Counter';

loadEnv();

@Resolver(User)
export class UserResolver {
  /** ***********************************
     QUERY
     ************************************ */

    @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    const users = await dataSource.getRepository(User).find({ relations: { services: true, counter: true } });
    const safeUsers = users.map((user) => getSafeAttributes(user));
    return safeUsers;
  }

  @Query(() => User)
    async getUserById(@Arg('id', () => Int) id: number): Promise<User> {
      const user = await dataSource
        .getRepository(User)
        .findOne({ where: { id }, relations: { services: true, counter: true } });

      if (user === null) throw new ApolloError('User not found', 'NOT_FOUND');
      return getSafeAttributes(user);
    }

  @Authorized()
  @Query(() => User)
  async profile(@Ctx() ctx: ContextType): Promise<User> {
    return getSafeAttributes(ctx.currentUser as User);
  }
  /** ***********************************
     MUTATION
     ************************************ */

  // @Authorized<RoleEnum>([1])
  @Mutation(() => User)
  async createUser(@Arg('data') data: UserInput): Promise<User> {
    const {
      firstname, lastname, email, password, role,
    } = data;
    
    const exisitingUser = await dataSource
    .getRepository(User)
    .findOne({ where: { email: email } });

  if (exisitingUser !== null) throw new ApolloError('EMAIL_ALREADY_EXISTS');
  if (!password) throw new ApolloError('PASSWORD REQUIRED')
  
    const hashedPassword = await hashPassword(password);


    const userServices = await Promise.all(data.services?.map(
      (service) => dataSource.getRepository(Service).findOneOrFail({ where: { id: service.id } }),
    ) || []);
    const counter = null;
    return await dataSource.getRepository(User).save({
      firstname, lastname, email, hashedPassword, role, services: userServices, counter,
    });

  }

  @Mutation(() => String)
  async login(
    @Arg('data') data: UserConnexion,
    @Ctx() ctx: ContextType,
  ): Promise<string> {
    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { email: data.email } });

    if (
      user === null
      || typeof user.hashedPassword !== 'string'
      || !(await verifyPassword(data.password, user.hashedPassword))
    ) { throw new ApolloError('invalid credentials'); }

    const token = jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);

    ctx.res.cookie('token', token, {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
    });

    return token;
  }

  @Mutation(() => String)
  async logout(@Ctx() ctx: ContextType): Promise<string> {
    ctx.res.clearCookie('token');
    return 'OK';
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
      firstname, lastname, email, role, services, counter,
    } = data;
    const userToUpdate = await dataSource.getRepository(User).findOne({
      where: { id }, relations: { services: true, counter: true },
    });

    if (userToUpdate === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }

    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.email = email;
    userToUpdate.role = role;

    userToUpdate.services = await Promise.all(services?.map(
      (service) => dataSource.getRepository(Service).findOneOrFail({ where: { id: service.id } }),
    ) || []);

    if (counter !== null && typeof (counter) !== 'undefined') {
      userToUpdate.counter = await dataSource.getRepository(Counter)
        .findOneOrFail({ where: { id: counter?.id } }) || null;
    } else {
      userToUpdate.counter = null;
    }

    await dataSource.getRepository(User).save(userToUpdate);

    return userToUpdate;
  }
}
