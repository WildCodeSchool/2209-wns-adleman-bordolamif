import { ApolloError } from 'apollo-server-errors';
import { verifyPassword } from '../entity/User';
import UserModel from '../models/UserModel';
import { ContextType } from '../utils/interfaces';
import { UserConnexion } from '../utils/types/InputTypes';
import jwt from 'jsonwebtoken';
import { env } from '../env';

const ConnexionController = {
  login: async (data:UserConnexion, ctx: ContextType) => {
    const user = await UserModel.getOneUserByMail(data.email);

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
  },

  logout: async (id:number, ctx: ContextType) => {
    const userToUpdate = await UserModel.getOneUserById(id);
    if (userToUpdate === null) throw new ApolloError('User not found', 'NOT_FOUND');

    userToUpdate.counter = null;
    userToUpdate.currentService = null;
    await UserModel.updateUser(userToUpdate);

    ctx.res.clearCookie('token');
    return 'OK';
  },
};
export default ConnexionController;
