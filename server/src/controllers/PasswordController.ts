import { hashPassword, verifyPassword } from '../entity/User';
import UserModel from '../models/UserModel';
import { FirstUserLoginPassword, UserConnexion, UserUpdatePassword } from '../utils/types/InputTypes';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

const PasswordController = {

  updatePassword: async (data: UserUpdatePassword) => {
    const { email, oldPassword, newPassword } = data;

    const userToUpdate = await UserModel.getOneUserByMail(email);

    if (
      userToUpdate === null
        || typeof userToUpdate.hashedPassword !== 'string'
        || !(await verifyPassword(oldPassword, userToUpdate.hashedPassword))
    ) { throw new Error('invalid credentials'); }

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
    ) { throw new Error('invalid credentials'); }

    const hashedPassword = await hashPassword(newPassword);

    userToUpdate.hashedPassword = hashedPassword;
    userToUpdate.isFirstLogin = false;

    return await UserModel.updateUser(userToUpdate);
  },

  forgotPassword: async (email:string) => {
    const user = await UserModel.getOneUserByMail(email);
    if (user === null) throw new Error('User not found');

    const resetToken = randomUUID();
    const tokenExpiratesIn = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(tokenExpiratesIn);

    await UserModel.updateUser(user);

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
  },

  resetPassword: async (uuid: string, data: UserConnexion) => {
    const { email, password } = data;

    const dateNow = new Date(Date.now());

    const userToUpdate = await UserModel.getOneUserByMail(email);

    if (
      userToUpdate === null
    || typeof userToUpdate.hashedPassword !== 'string'
    || uuid !== userToUpdate.resetPasswordToken
    ) { throw new Error('invalid credentials'); }

    if (userToUpdate.resetPasswordExpires && dateNow > userToUpdate.resetPasswordExpires) { throw new Error('Link to reset password has exired'); }

    const hashedPassword = await hashPassword(password);

    userToUpdate.hashedPassword = hashedPassword;
    userToUpdate.resetPasswordExpires = undefined;
    userToUpdate.resetPasswordToken = undefined;

    return await UserModel.updateUser(userToUpdate);
  },
};

export default PasswordController;
