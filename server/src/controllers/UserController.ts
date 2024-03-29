import User, { hashPassword } from '../entity/User';
import CounterModel from '../models/CounterModel';
import ServiceModel from '../models/ServiceModel';
import UserModel from '../models/UserModel';
import { PartialUserInput, UserInput } from '../utils/types/InputTypes';
import ServiceController from './ServiceController';

const UserController = {
  getAllUsers: async (connected?: boolean): Promise<User[]> => {
    const users = await UserModel.getAllUsers(connected);
    return users;
  },

  getOneUser: async (id: number): Promise<User> => {
    const user = await UserModel.getOneUserById(id);
    if (user === null) throw new Error('User not found');
    return user;
  },

  createUser: async (data: UserInput): Promise<User> => {
    const {
      firstname, lastname, email, role, services,
    } = data;

    const exisitingUser = await UserModel.getOneUserByMail(email);

    if (exisitingUser !== null) throw new Error('EMAIL_ALREADY_EXISTS');

    let password;
    if (role === 2) password = `${firstname}${lastname}00!`;
    else {
      if (!data.password) {
        throw new Error('PASSWORD REQUIRED');
      }
      password = data.password;
    }

    const hashedPassword = await hashPassword(password);

    const userServices = await Promise.all(
      services?.map((service) => ServiceModel.getOneArgService(service.id))
        || [],
    );
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

  updateUser: async (data: UserInput, id: number) => {
    const previousService = await ServiceModel.getOneServiceByCurrentUserId(id);
    await UserController.resetUserAssignments(id);
    const {
      firstname,
      lastname,
      email,
      role,
      services,
      counter,
      currentService,
    } = data;
    const userToUpdate = await UserModel.getOneUserById(id);

    if (userToUpdate === null) {
      throw new Error('User not found');
    }
    const currentServiceId = currentService ? currentService.id : null;

    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.email = email;
    userToUpdate.role = role;
    if (
      services !== null
      && typeof services !== 'undefined'
      && services!.length > 0
    ) {
      userToUpdate.services = await Promise.all(
        services?.map((service) => ServiceModel.getOneArgService(service.id))
          || [],
      );
    } else {
      userToUpdate.services = [];
    }
    if (counter !== null && typeof counter !== 'undefined') {
      userToUpdate.counter = (await CounterModel.getOneArgCounter(counter.id)) || null;
      if (userToUpdate.counter === null) throw new Error('Counter not found');
    } else {
      if (userToUpdate.counter !== null) {
        const counterToUpdate = (await CounterModel.getOneCounterByUserId(id)) || null;

        if (counterToUpdate! && typeof counterToUpdate.user !== 'undefined') {
          await CounterModel.updateCounter(counterToUpdate);
        }
      }

      userToUpdate.counter = null;
    }

    if (currentService !== null && typeof currentService !== 'undefined') {
      userToUpdate.currentService = await ServiceModel.getOneArgService(currentService.id)
       || null;
    } else {
      userToUpdate.currentService = null;
    }

    await UserModel.updateUser(userToUpdate);
    await ServiceController.updateServicesIsOpenByCurrentUsers(
      previousService?.id || null,
      currentServiceId,
    );

    return await UserController.getOneUser(userToUpdate.id);
  },

  updateUserSuspension: async (isSuspended: boolean, id: number) => {
    const userToUpdate = await UserModel.getOneUserById(id);
    if (userToUpdate === null) {
      throw new Error('User not found');
    }
    userToUpdate.isSuspended = isSuspended;
    return await UserModel.updateUser(userToUpdate);
  },

  partialUserUpdate: async (data: PartialUserInput, id: number) => {
    const user = await UserModel.getOneUserById(id);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    user.firstname = data.firstname ?? user.firstname;
    user.lastname = data.lastname ?? user.lastname;
    user.email = data.email ?? user.email;
    user.isSuspended = data.isSuspended ?? user.isSuspended;
    user.role = data.role ?? user.role;

    if (data.counter) {
      const counter = await CounterModel.getOneCounterById(data.counter.id);
      user.counter = counter;
      if (counter) CounterModel.updateCounter(counter);
    }
    if (data.services) {
      const services = await ServiceModel.getMultipleServicesByIds(
        data.services,
      );
      user.services = services;
    }
    if (data.currentService && data.currentService !== null) {
      const currentService = await ServiceModel.getOneServiceById(
        data.currentService.id,
      );
      currentService!.isOpen = true;
      await ServiceModel.updateService(currentService!);

      user.currentService = currentService;
    } else if (data.currentService === null) {
      const serviceToUpdate = await ServiceModel.getOneServiceByCurrentUserId(
        id,
      );
      if (serviceToUpdate === null) throw new Error('Service not found');
      serviceToUpdate.isOpen = false;
      await ServiceModel.updateService(serviceToUpdate);
    }

    return UserModel.updateUser(user);
  },

  resetUserAssignments: async (id: number) => {
    const userToUpdate = await UserModel.getOneUserById(id);
    if (userToUpdate === null) throw new Error('User not found');

    const counterToUpade = userToUpdate.counter;
    const serviceToUpdate = userToUpdate.currentService;

    userToUpdate.counter = null;
    userToUpdate.currentService = null;
    await UserModel.updateUser(userToUpdate);

    if (counterToUpade !== null && typeof counterToUpade !== 'undefined') {
      counterToUpade!.user = undefined;
      await CounterModel.updateCounter(counterToUpade);
    }
    if (serviceToUpdate !== null && typeof serviceToUpdate !== 'undefined') {
      serviceToUpdate!.currentUsers = serviceToUpdate!.currentUsers?.filter(
        (user) => user.id === userToUpdate.id,
      );
      await ServiceModel.updateService(serviceToUpdate);
      await ServiceController.updateServicesIsOpenByCurrentUsers(
        serviceToUpdate.id,
      );
    }
  },

  deleteUser: async (id: number) => {
    const { affected } = await UserModel.deleteUser(id);
    if (affected === 0) throw new Error('User not found');
    return true;
  },
};

export default UserController;
