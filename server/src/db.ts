import {DataSource} from "typeorm";
import {env, loadEnv} from "./env";
import Counter from "./entity/Counter";
import WaitingRoom from './entity/WaitingRoom';

loadEnv();

export default new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    synchronize: true,
    entities: [Counter,WaitingRoom],
    logging: ["error"],
});
