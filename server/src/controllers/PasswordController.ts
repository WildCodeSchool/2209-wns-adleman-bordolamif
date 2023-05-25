import { hashPassword, verifyPassword } from '../entity/User';
import UserModel from '../models/UserModel';
import {
  FirstUserLoginPassword,
  UserUpdatePassword,
} from '../utils/types/InputTypes';
import { randomUUID } from 'crypto';
import { env, loadEnv } from '../env';
import Mailjet from 'node-mailjet';

loadEnv();

const PasswordController = {
  updatePassword: async (data: UserUpdatePassword) => {
    const { email, oldPassword, newPassword } = data;

    const userToUpdate = await UserModel.getOneUserByMail(email);

    if (
      userToUpdate === null
      || typeof userToUpdate.hashedPassword !== 'string'
      || !(await verifyPassword(oldPassword, userToUpdate.hashedPassword))
    ) {
      throw new Error('invalid credentials');
    }

    const hashedPassword = await hashPassword(newPassword);

    userToUpdate.hashedPassword = hashedPassword;

    return await UserModel.updateUser(userToUpdate);
  },

  firstLoginPassword: async (data: FirstUserLoginPassword) => {
    const { email, newPassword } = data;

    const userToUpdate = await UserModel.getOneUserByMail(email);

    if (
      userToUpdate === null
      || typeof userToUpdate.hashedPassword !== 'string'
    ) {
      throw new Error('invalid credentials');
    }

    const hashedPassword = await hashPassword(newPassword);

    userToUpdate.hashedPassword = hashedPassword;
    userToUpdate.isFirstLogin = false;

    return await UserModel.updateUser(userToUpdate);
  },

  forgotPassword: async (email: string) => {
    const user = await UserModel.getOneUserByMail(email);
    if (user === null) throw new Error('User not found');

    const resetToken = randomUUID();
    const tokenExpiratesIn = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(tokenExpiratesIn);

    await UserModel.updateUser(user);

    const mailjet = Mailjet.apiConnect(
      env.MJ_APIKEY_PUBLIC,
      env.MJ_APIKEY_PRIVATE,
    );

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'sandra.voisin@hotmail.fr',
            Name: 'Sandra VOISIN',
          },
          To: [
            {
              Email: user.email,
              Name: `${user.firstname} ${user.lastname}`,
            },
          ],
          Subject: 'Wait It : Réinitialisez votre mot de passe',
          TextPart:
            `
            Mot de passe oublié ?
            
            Bonjour,
            Nous avons reçu une demande de modification de mot de passe pour votre compte ${user.email}.
            Aucun changement n'a été effectué pour le moment.
            Vous pouvez réinitialiser le mot de passe de votre compte en copiant le lien ci-dessous dans votre navigateur
            http://localhost:3000/reset-password/${user.resetPasswordToken}
            `,
          HTMLPart:
            `
            <h1>Mot de passe oublié ?</h1>
            <p>
            Bonjour, <br />
            Nous avons reçu une demande de modification de mot de passe pour votre compte ${user.email}.
            Aucun changement n'a été effectué pour le moment. <br />
            Vous pouvez réinitialiser le mot de passe de votre compte en cliquant sur le lien ci-dessous
            </p>
            <a href="http://localhost:3000/reset-password/${user.resetPasswordToken}">Réinitialiser mon mot de passe</a>!
            `,
        },
      ],
    });

    request
      .then((result) => {
        console.warn(result.body);
      })
      .catch((err) => {
        console.warn(err, err.statusCode);
      });
  },

  resetPassword: async (uuid: string, password: string) => {
    const dateNow = new Date(Date.now());

    const userToUpdate = await UserModel.getOneUserByResetPasswordToken(uuid);

    if (
      userToUpdate === null
      || (dateNow > userToUpdate.resetPasswordExpires!)
    ) {
      throw new Error('Link to reset password has exired');
    }

    const hashedPassword = await hashPassword(password);

    userToUpdate.hashedPassword = hashedPassword;
    userToUpdate.resetPasswordExpires = undefined;
    userToUpdate.resetPasswordToken = undefined;

    return await UserModel.updateUser(userToUpdate);
  },
};

export default PasswordController;
