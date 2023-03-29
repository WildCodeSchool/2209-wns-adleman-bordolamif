import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import User, { getSafeAttributes } from '../entity/User';
import { loadEnv } from '../env';
import { ContextType } from '../utils/interfaces';
import {
  FirstUserLoginPassword,
  UserConnexion,
  UserInput,
  UserUpdatePassword,
} from '../utils/types/InputTypes';
import UserController from '../controllers/UserController';
import PasswordController from '../controllers/PasswordController';
import ConnexionController from '../controllers/ConnexionController';

loadEnv();

@Resolver(User)
export class UserResolver {
  /** ***********************************
                   QUERY
     ************************************ */

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    const users = await UserController.getAllUsers();
    return users.map((user) => getSafeAttributes(user));
  }

  @Query(() => User)
  async getOneUser(@Arg('id', () => Int) id: number): Promise<User> {
    const user = await UserController.getOneUser(id);
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
    const newUser = await UserController.createUser(data);
    return getSafeAttributes(newUser);
  }

  @Mutation(() => String)
  async login(
    @Arg('data') data: UserConnexion,
    @Ctx() ctx: ContextType,
  ): Promise<string> {
    const token = await ConnexionController.login(data, ctx);
    return token;
  }

  @Mutation(() => String)
  async logout(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: ContextType,
  ): Promise<string> {
    return await ConnexionController.logout(id, ctx);
  }

  // @Authorized<RoleEnum>([1])
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number): Promise<boolean> {
    return await UserController.deleteUser(id);
  }

  @Mutation(() => User)
  async updatePassword(@Arg('data') data: UserUpdatePassword): Promise<User> {
    const userToUpdate = await PasswordController.updatePassword(data);
    return getSafeAttributes(userToUpdate);
  }

  @Mutation(() => User)
  async firstLoginPassword(
    @Arg('data') data: FirstUserLoginPassword,
  ): Promise<User> {
    const userToUpdate = await PasswordController.firstLoginPassword(data);
    return getSafeAttributes(userToUpdate);
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UserInput,
  ): Promise<User> {
    const userToUpdate = await UserController.updateUser(data, id);
    return getSafeAttributes(userToUpdate);
  }

  @Mutation(() => String)
  async forgotPassword(
    @Arg('email', () => String) email: string,
  ): Promise<string> {
    await PasswordController.forgotPassword(email);
    return 'Un email vous a été envoyé pour réinitialiser votre mot de passe';
  }

  @Mutation(() => User)
  async resetPassword(
    @Arg('uuid', () => String) uuid: string,
    @Arg('data') data: UserConnexion,
  ): Promise<User> {
    const userToUpdate = await PasswordController.resetPassword(uuid, data);

    return getSafeAttributes(userToUpdate);
  }
}
