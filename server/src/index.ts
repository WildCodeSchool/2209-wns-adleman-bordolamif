import 'reflect-metadata';
import datasource from './db';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { join } from 'path';
import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env, loadEnv } from './env';
import User from './entity/User';
import cors from 'cors';
import http from 'http';
import cookie from 'cookie';
import { buildSchema } from 'type-graphql';
import { CounterResolver } from './resolvers/CounterResolver';
import { WaitingRoomResolver } from './resolvers/WaitingRoomResolver';
import { UserResolver } from './resolvers/UserResolver';
import { ServiceResolver } from './resolvers/ServiceResolver';
import { TicketResolver } from './resolvers/TicketResolver';
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

      try {
        let decoded;
        // https:// www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        if (token) decoded = jwt.verify(token, env.JWT_PRIVATE_KEY);
        if (typeof decoded === 'object') context.jwtPayload = decoded;
      } catch (err) {
        throw new Error('Error while authenticating user');
      }

      let user;
      if (context.jwtPayload) {
        user = await datasource
          .getRepository(User)
          .findOne({ where: { id: context.jwtPayload.userId } });
      }

      if (user !== null) context.currentUser = user;

      if (!context.currentUser) return false;
      return roles.length === 0 || roles.includes(context.currentUser.role);
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
