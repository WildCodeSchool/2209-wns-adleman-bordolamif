import {
  Arg, Authorized, Ctx, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import User, { getSafeAttributes, hashPassword, verifyPassword } from '../entity/User';
import dataSource from '../db';
import { ApolloError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';
import { env, loadEnv } from '../env';
import { ContextType } from '../utils/interfaces';
import {
  FirstUserLoginPassword,
  UserConnexion,
  UserInput,
  UserUpdatePassword,
} from '../utils/types/InputTypes';
import Service from '../entity/Service';
import Counter from '../entity/Counter';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';

loadEnv();

@Resolver(User)
export class UserResolver {
  /** ***********************************
                   QUERY
     ************************************ */

    @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    const users = await dataSource.getRepository(User)
      .find({
        relations: {
          services: true, counter: true, tickets: true, currentService: true,
        },
      });
    const safeUsers = users.map((user) => getSafeAttributes(user));
    return safeUsers;
  }

    @Query(() => User)
    async getOneUser(@Arg('id', () => Int) id: number): Promise<User> {
      const user = await dataSource
        .getRepository(User)
        .findOne({
          where: { id },
          relations: {
            services: true, counter: true, tickets: true, currentService: true,
          },
        });

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
        firstname, lastname, email, role,
      } = data;

      const exisitingUser = await dataSource
        .getRepository(User)
        .findOne({ where: { email } });

      if (exisitingUser !== null) throw new ApolloError('EMAIL_ALREADY_EXISTS');
      if (!data.password) {
        if (role !== 2) throw new ApolloError('PASSWORD REQUIRED');
        else {
          data.password = `${firstname}${lastname}00!`;
        }
      }
      const hashedPassword = await hashPassword(data.password);

      const userServices = await Promise.all(data.services?.map(
        (service) => dataSource.getRepository(Service).findOneOrFail({ where: { id: service.id } }),
      ) || []);
      const counter = null;
      const newUser = await dataSource.getRepository(User).save({
        firstname,
        lastname,
        email,
        hashedPassword,
        role,
        isFirstLogin: role !== 1,
        services: userServices,
        counter,
      });
      return getSafeAttributes(newUser);
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
    async updatePassword(
        @Arg('id', () => Int) id: number,
        @Arg('data') data: UserUpdatePassword,
    ): Promise<User> {
      const { email, oldPassword, newPassword } = data;

      const userToUpdate = await dataSource
        .getRepository(User)
        .findOne({ where: { email } });

      if (
        userToUpdate === null
    || typeof userToUpdate.hashedPassword !== 'string'
    || !(await verifyPassword(oldPassword, userToUpdate.hashedPassword))
      ) { throw new ApolloError('invalid credentials'); }

      const hashedPassword = await hashPassword(newPassword);

      userToUpdate.hashedPassword = hashedPassword;

      await dataSource.getRepository(User).save(userToUpdate);

      return getSafeAttributes(userToUpdate);
    }

  @Mutation(() => User)
    async firstLoginPassword(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: FirstUserLoginPassword,
    ): Promise<User> {
      const { email, newPassword } = data;

      const userToUpdate = await dataSource
        .getRepository(User)
        .findOne({ where: { email } });

      if (
        userToUpdate === null
      || typeof userToUpdate.hashedPassword !== 'string'
      ) { throw new ApolloError('invalid credentials'); }

      const hashedPassword = await hashPassword(newPassword);

      userToUpdate.hashedPassword = hashedPassword;
      userToUpdate.isFirstLogin = false;

      await dataSource.getRepository(User).save(userToUpdate);

      return getSafeAttributes(userToUpdate);
    }

  @Mutation(() => User)
  async updateUser(
        @Arg('id', () => Int) id: number,
        @Arg('data') data: UserInput,
  ): Promise<User> {
    const {
      firstname, lastname, email, role, services, counter, currentService,
    } = data;
    const userToUpdate = await dataSource.getRepository(User).findOne({
      where: { id },
      relations: {
        services: true, counter: true, tickets: true, currentService: true,
      },
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

    if (currentService !== null && typeof (currentService) !== 'undefined') {
      const serviceToUpdate = await dataSource.getRepository(Service)
        .findOneOrFail({ where: { id: currentService?.id } }) || null;
      serviceToUpdate.open = true;
      await dataSource.getRepository(Service).save(serviceToUpdate);
      userToUpdate.currentService = serviceToUpdate;
    } else {
      const serviceToUpdate = await dataSource.getRepository(Service)
        .findOneOrFail({
          where: { currentUsers: { id } },
          relations: {
            waitingRoom: true, tickets: true, users: true, currentUsers: true,
          },
        }) || null;

      if (serviceToUpdate!
          && typeof (serviceToUpdate.currentUsers) !== 'undefined'
          && serviceToUpdate!.currentUsers!.length === 1) {
        serviceToUpdate.open = false;
        await dataSource.getRepository(Service).save(serviceToUpdate);
      }
      userToUpdate.currentService = null;
    }

    await dataSource.getRepository(User).save(userToUpdate);

    return getSafeAttributes(userToUpdate);
  }

  @Mutation(() => String)
  async forgotPassword(@Arg('email', () => String) email: string): Promise<string> {
    const user = await dataSource.getRepository(User).findOne({ where: { email } });
    if (user === null) throw new ApolloError('User not found', 'NOT_FOUND');

    const resetToken = randomUUID();
    const tokenExpiratesIn = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(tokenExpiratesIn);

    await dataSource.getRepository(User).save(user);

    // eslint-disable-next-line no-constant-condition
    if (process.env.NODE_ENV === 'development' || 'test') {
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const resetLink = `http://localhost:3000/resetPassword/${resetToken}`;
      const mailOptions = {
        from: 'email@example.com',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
      };
      const info = await transporter.sendMail(mailOptions);
      // eslint-disable-next-line no-restricted-syntax
      console.log('mail available at : ', nodemailer.getTestMessageUrl(info));
    }
    return 'Un email vous a été envoyé pour réinitialiser votre mot de passe';
  }

  @Mutation(() => User)
  async resetPassword(
        @Arg('uuid', () => String) uuid: string,
        @Arg('data') data: UserConnexion,
  ): Promise<User> {
    const { email, password } = data;

    const dateNow = new Date(Date.now());

    const userToUpdate = await dataSource
      .getRepository(User)
      .findOne({ where: { email } });

    if (
      userToUpdate === null
    || typeof userToUpdate.hashedPassword !== 'string'
    || uuid !== userToUpdate.resetPasswordToken
    ) { throw new ApolloError('invalid credentials'); }

    if (userToUpdate.resetPasswordExpires && dateNow > userToUpdate.resetPasswordExpires) { throw new ApolloError('Link to reset password has exired'); }

    const hashedPassword = await hashPassword(password);

    userToUpdate.hashedPassword = hashedPassword;
    userToUpdate.resetPasswordExpires = undefined;
    userToUpdate.resetPasswordToken = undefined;

    await dataSource.getRepository(User).save(userToUpdate);

    return getSafeAttributes(userToUpdate);
  }
}
