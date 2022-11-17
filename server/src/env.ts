import {EnvType, load} from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
    NODE_ENV: ['production' as const, 'development' as const],
    POSTGRES_PASSWORD: String,
    POSTGRES_USER: String,
    POSTGRES_DB: String
};

export let env: Env;

export function loadEnv(): void {
    env = load(schema);
}
