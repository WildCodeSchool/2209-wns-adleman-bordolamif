import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: '',
  password: '',
  database: '',
  synchronize: true,
  entities: [],
  logging: ['query', 'error']
})

export default dataSource;
