import 'reflect-metadata';
import datasource from './db';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
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

loadEnv();

const start = async (): Promise<void> => {
  await datasource.initialize();

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
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  await server.listen().then(({ url }) => {
    // eslint-disable-next-line no-restricted-syntax
    console.log(`💻 Apollo Server Sandbox on ${url} 💻`);
  });
};

// eslint-disable-next-line no-void
void start();
