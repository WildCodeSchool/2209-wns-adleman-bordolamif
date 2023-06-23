import UserController from '../controllers/UserController';
import UserModel from '../models/UserModel';
import { generateRandomPassword } from './builders/randomPassword';

export const checkDefaultAdmin = async () => {
  const adminExist = await UserModel.getOneUserByMail('admin.wait-it@ik.me');
  if (!adminExist) {
    await UserController.createUser({
      firstname: 'Admin',
      lastname: 'WAIT IT',
      email: 'admin.wait-it@ik.me',
      role: 1,
      password: generateRandomPassword(10),
    });
  }
};
