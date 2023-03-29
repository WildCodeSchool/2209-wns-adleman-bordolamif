import { ApolloError } from 'apollo-server-errors';
import User, { hashPassword } from '../entity/User';
import CounterModel from '../models/CounterModel';
import ServiceModel from '../models/ServiceModel';
import UserModel from '../models/UserModel';
import { UserInput } from '../utils/types/InputTypes';

const UserController = {
  getAllUsers: async (): Promise<User[]> => await UserModel.getAllUsers(),

  getOneUser: async (id: number): Promise<User> => {
    const user = await UserModel.getOneUserById(id);
    if (user === null) throw new ApolloError('User not found', 'NOT_FOUND');
    return user;
  },

  createUser: async (data: UserInput): Promise<User> => {
    const {
      firstname, lastname, email, role, services,
    } = data;

    const exisitingUser = await UserModel.getOneUserByMail(email);

    if (exisitingUser !== null) throw new ApolloError('EMAIL_ALREADY_EXISTS');
    if (!data.password) {
      if (role === 2) data.password = `${firstname}${lastname}00!`;
      else {
        throw new ApolloError('PASSWORD REQUIRED');
      }
    }
    const hashedPassword = await hashPassword(data.password);

    const userServices = await Promise.all(services?.map(
      (service) => ServiceModel.getOneArgService(service.id),
    ) || []);
    const counter = null;
    return await UserModel.createUser({
      firstname,
      lastname,
      email,
      hashedPassword,
      role,
      isFirstLogin: role === 2,
      services: userServices,
      counter,
    });
  },

  updateUser: async (data: UserInput, id:number) => {
    const {
      firstname, lastname, email, role, services, counter, currentService,
    } = data;
    const userToUpdate = await UserModel.getOneUserById(id);

    if (userToUpdate === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }

    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.email = email;
    userToUpdate.role = role;
    if (services !== null && typeof (services) !== 'undefined' && services!.length > 0) {
      userToUpdate.services = await Promise.all(services?.map(
        (service) => ServiceModel.getOneArgService(service.id),
      ) || []);
    } else {
      userToUpdate.services = [];
    }
    if (counter !== null && typeof (counter) !== 'undefined') {
      userToUpdate.counter = await CounterModel.getOneArgCounter(counter.id) || null;
    } else {
      userToUpdate.counter = null;
    }

    if (currentService !== null && typeof (currentService) !== 'undefined') {
      const serviceToUpdate = await ServiceModel.getOneArgService(currentService.id) || null;
      serviceToUpdate.isOpen = true;
      await ServiceModel.updateService(serviceToUpdate);
      userToUpdate.currentService = serviceToUpdate;
    } else {
      if (userToUpdate.currentService !== null) {
        const serviceToUpdate = await ServiceModel.getOneServiceByCurrentUserId(id) || null;

        if (serviceToUpdate!
              && typeof (serviceToUpdate.currentUsers) !== 'undefined'
              && serviceToUpdate!.currentUsers!.length === 1) {
          serviceToUpdate.isOpen = false;
          await ServiceModel.updateService(serviceToUpdate);
        }
      }

      userToUpdate.currentService = null;
    }

    return await UserModel.updateUser(userToUpdate);
  },

  updateUserIsSuspended: async (isSuspended: boolean, id: number) => {
    const userToUpdate = await UserModel.getOneUserById(id);
    if (userToUpdate === null) { throw new ApolloError('User not found', 'NOT_FOUND'); }
    userToUpdate.isSuspended = isSuspended;
    return await UserModel.updateUser(userToUpdate);
  },

  deleteUser: async (id: number) => {
    const { affected } = await UserModel.deleteUser(id);
    if (affected === 0) throw new ApolloError('User not found', 'NOT_FOUND');
    return true;
  },
};

export default UserController;
