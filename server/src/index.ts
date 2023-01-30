import 'reflect-metadata';
import datasource from './db';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { CounterResolver } from './resolvers/CounterResolver';
import { WaitingRoomResolver } from './resolvers/WaitingRoomResolver';
import { UserResolver } from './resolvers/UserResolver';
import { ServiceResolver } from './resolvers/ServiceResolver';
import { TicketResolver } from './resolvers/TicketResolver';
import User from './entity/User';
import jwt from 'jsonwebtoken';
import { env, loadEnv } from './env';
import { ContextType } from './utils/interfaces';
import http from 'http';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

loadEnv();

const start = async (): Promise<void> => {
  await datasource.initialize();

  const app = express();
  const httpServer = http.createServer(app);
  const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(',');

  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (typeof origin === 'undefined' || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
    }),
  );

  app.use(cookieParser());

  const schema = await buildSchema({
    resolvers: [
      CounterResolver,
      WaitingRoomResolver,
      ServiceResolver,
      TicketResolver,
      UserResolver,
    ],
    authChecker: async ({ context }: { context: ContextType }, roles) => {
      const tokenInHeaders = context.req.headers.authorization?.split(' ')[1];
      const tokenInCookie = context.req.cookies?.token;
      const token = tokenInHeaders || tokenInCookie;

      try {
        let decoded;
        // https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
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

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false, path: '/' });
  // eslint-disable-next-line no-restricted-syntax
  httpServer.listen({ port: env.SERVER_PORT }, () => console.log(
    `🚀 Server ready at http://${env.SERVER_HOST}:${env.SERVER_PORT}${server.graphqlPath}`,
  ));
};

// eslint-disable-next-line no-void
void start();
