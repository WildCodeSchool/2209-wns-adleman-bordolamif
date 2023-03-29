import 'reflect-metadata';
import datasource from './db';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { join } from 'path';
import express from 'express';
import jwt from 'jsonwebtoken';
import { env, loadEnv } from './env';
import User from './entity/User';
import cors from 'cors';
import http from 'http';
import cookie from 'cookie';
import { buildSchema } from 'type-graphql';
import { ContextType } from './utils/interfaces';

loadEnv();

const start = async (): Promise<void> => {
  await datasource.initialize();
  const app = express();
  const httpServer = http.createServer(app);

  const schema = await buildSchema({
    resolvers: [join(__dirname, '/resolvers/*.ts')],
    authChecker: async ({ context }: { context: ContextType }, roles = []) => {
      const { req } = context;
      const tokenInHeaders = req.headers.authorization?.split(' ')[1];
      const tokenInCookie = cookie.parse(req.headers.cookie ?? '').token;
      const token = tokenInHeaders ?? tokenInCookie;

      if (typeof token !== 'string') return false;

      const decoded = jwt.verify(token, env.JWT_PRIVATE_KEY);
      if (typeof decoded !== 'object') return false;

      const id = decoded.userId;
      const currentUser = await datasource.getRepository(User).findOneBy({ id });
      if (currentUser === null) return false;

      context.currentUser = currentUser;
      return roles.length === 0 || roles.includes(currentUser.role);
    },
  });

  const server = new ApolloServer<ContextType>({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  await server.start();

  app.use(
    ['/', '/graphql'],
    cors<cors.CorsRequest>({
      origin: env.CORS_ALLOWED_ORIGINS.split(','),
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  );

  const port = env.SERVER_PORT ?? 4000;

  // eslint-disable-next-line no-restricted-syntax
  httpServer.listen({ port }, () => console.log(
    `🚀 Server ready at http://${env.SERVER_HOST}:${port}`,
  ));
};

start().catch(console.error);
