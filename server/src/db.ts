import { DataSource } from 'typeorm';
import Counter from './entity/Counter';
import WaitingRoom from './entity/WaitingRoom';

export default new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  entities: [Counter, WaitingRoom],
  logging: ['error'],
});
