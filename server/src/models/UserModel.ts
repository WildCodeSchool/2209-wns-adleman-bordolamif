import User from '../entity/User';
import dataSource from '../db';
import { NewUserDto } from '../utils/dto';

const UserModel = {
  getAllUsers: async () => await dataSource.getRepository(User)
    .find({
      relations: {
        services: true, counter: true, tickets: true, currentService: true,
      },
    }),

  getOneUserById: async (id:number) => await dataSource
    .getRepository(User)
    .findOne({
      where: { id },
      relations: {
        services: true, counter: true, tickets: true, currentService: true,
      },
    }),

  getOneUserByMail: async (email:string) => await dataSource
    .getRepository(User)
    .findOne({ where: { email } }),

  getOneArgUser: async (id: number) => await
  dataSource.getRepository(User).findOneOrFail({ where: { id } }),

  createUser: async (userToCreate: NewUserDto) => await
  dataSource.getRepository(User).save(userToCreate),

  updateUser: async (userToUpdate: User) => await dataSource.getRepository(User).save(userToUpdate),

  deleteUser: async (id: number) => await dataSource.getRepository(User).delete(id),
};

export default UserModel;
