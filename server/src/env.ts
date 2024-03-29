import { EnvType, load } from 'ts-dotenv';

// eslint-disable-next-line no-use-before-define
export type Env = EnvType<typeof schema>;

export const schema = {
  NODE_ENV: ['production' as const, 'development' as const, 'test' as const],
  POSTGRES_PASSWORD: String,
  POSTGRES_USER: String,
  POSTGRES_DB: String,
  POSTGRES_DB_TEST: String,
  DB_PORT: Number,
  JWT_PRIVATE_KEY: String,
  CORS_ALLOWED_ORIGINS: String,
  SERVER_HOST: String,
  SERVER_PORT: Number,
  DB_HOST: String,
  EXPO_ACCESS_TOKEN: String,
  MJ_APIKEY_PUBLIC: String,
  MJ_APIKEY_PRIVATE: String,
};

// eslint-disable-next-line import/no-mutable-exports
export let env: Env;

export function loadEnv(): void {
  env = load(schema);
}
