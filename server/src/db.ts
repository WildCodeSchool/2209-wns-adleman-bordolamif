import {DataSource} from "typeorm";
import Counter from "./entity/Counter";

export default new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    entities: [Counter],
    logging: ["error"],
});
