import User from '../entity/User';
import dataSource from '../db';
import { NewUserDto } from '../utils/dto';
import { IsNull, Not } from 'typeorm';

const UserModel = {
  getAllUsers: async (connected?:boolean) => {
    if (connected) {
      return await dataSource.getRepository(User)
        .find({
          order: { id: 'ASC' },
          where: { currentService: Not(IsNull()) },
          relations: {
            services: true, counter: true, tickets: true, currentService: true,
          },
        });
    }
    return await dataSource.getRepository(User)
      .find({
        order: { id: 'ASC' },
        relations: {
          services: true, counter: true, tickets: true, currentService: true,
        },
      });
  },

  getOneUserById: async (id:number) => await dataSource
    .getRepository(User)
    .findOne({
      where: { id },
      relations: {
        services: {
          waitingRoom: true,
        },
        counter: {
          ticket: true,
          waitingRoom: true,
        },
        tickets: true,
        currentService: true,
      },
    }),

  getOneUserByMail: async (email:string) => await dataSource
    .getRepository(User)
    .findOne({ where: { email } }),

  getOneArgUser: async (id: number) => await
  dataSource.getRepository(User).findOneOrFail({ where: { id } }),

  createUser: async (userToCreate: NewUserDto) => await
  dataSource.getRepository(User).save(userToCreate),

  updateUser: async (
    userToUpdate: User,
  ) => await dataSource.getRepository(User).save(userToUpdate),

  deleteUser: async (id: number) => await dataSource.getRepository(User).delete(id),
};

export default UserModel;
