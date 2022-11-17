import {DataSource} from "typeorm";
import Counter from "./entity/Counter";
import {env, loadEnv} from "./env";

loadEnv();

export default new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    synchronize: true,
    entities: [Counter],
    logging: ["error"],
});
