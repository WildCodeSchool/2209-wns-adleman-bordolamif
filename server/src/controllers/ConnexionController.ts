import { verifyPassword } from '../entity/User';
import UserModel from '../models/UserModel';
import { ContextType } from '../utils/interfaces';
import { UserConnexion } from '../utils/types/InputTypes';
import jwt from 'jsonwebtoken';
import { env, loadEnv } from '../env';
import CounterModel from '../models/CounterModel';
import ServiceModel from '../models/ServiceModel';

loadEnv();

const ConnexionController = {
  login: async (data:UserConnexion, ctx: ContextType) => {
    const user = await UserModel.getOneUserByMail(data.email);

    if (
      user === null
    || typeof user.hashedPassword !== 'string'
    || !(await verifyPassword(data.password, user.hashedPassword))
    ) { throw new Error('invalid credentials'); }

    if (user.isSuspended) { throw new Error('user suspended'); }

    const token = jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);

    ctx.res.cookie('token', token, {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
    });
    return token;
  },

  logout: async (id:number, ctx: ContextType) => {
    const userToUpdate = await UserModel.getOneUserById(id);
    if (userToUpdate === null) throw new Error('User not found');

    const counterToUpade = userToUpdate.counter;
    if (counterToUpade !== null && typeof (counterToUpade) !== 'undefined') {
      counterToUpade!.user = undefined;
      await CounterModel.updateCounter(counterToUpade);
    }

    const serviceToUpdate = userToUpdate.currentService;
    if (serviceToUpdate !== null && typeof (serviceToUpdate) !== 'undefined') {
      serviceToUpdate!.currentUsers = serviceToUpdate!.currentUsers?.filter(
        (user) => user.id === userToUpdate.id,
      );
      await ServiceModel.updateService(serviceToUpdate);
    }
    userToUpdate.counter = null;
    userToUpdate.currentService = null;
    await UserModel.updateUser(userToUpdate);

    ctx.res.clearCookie('token');
    return 'OK';
  },
};
export default ConnexionController;
