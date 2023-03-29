import Service from './entity/Service';
import Ticket from './entity/Ticket';
import { DataSource } from 'typeorm';
import { env, loadEnv } from './env';
import Counter from './entity/Counter';
import WaitingRoom from './entity/WaitingRoom';
import User from './entity/User';

loadEnv();

export default new DataSource({
  type: 'postgres',
  // eslint-disable-next-line no-nested-ternary
  host: process.env.NODE_ENV === 'test' ? 'db_test' : process.env.NODE_ENV === 'development' ? 'db' : 'db_prod',
  port: 5432,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? env.POSTGRES_DB_TEST : env.POSTGRES_DB,
  synchronize: true,
  entities: [Counter, WaitingRoom, Service, Ticket, User],
  logging: ['error'],
});
