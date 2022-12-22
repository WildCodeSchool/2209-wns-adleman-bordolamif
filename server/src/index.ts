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
