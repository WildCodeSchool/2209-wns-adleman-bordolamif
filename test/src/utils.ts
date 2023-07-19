/* eslint-disable import/no-relative-packages */
import jwt from 'jsonwebtoken';
import { env } from '../../server/src/env';
import User from '../../server/src/entity/User';
import dataSource from '../../server/src/db';

export async function getJWTFor(user: Partial<User>) {
  await dataSource.getRepository(User).save(user);
  return jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);
}
