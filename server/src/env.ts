import { EnvType, load } from 'ts-dotenv';

// eslint-disable-next-line no-use-before-define
export type Env = EnvType<typeof schema>;

export const schema = {
  NODE_ENV: ['production' as const, 'development' as const],
  POSTGRES_PASSWORD: String,
  POSTGRES_USER: String,
  POSTGRES_DB: String,
};

// eslint-disable-next-line import/no-mutable-exports
export let env: Env;

export function loadEnv(): void {
  env = load(schema);
}
