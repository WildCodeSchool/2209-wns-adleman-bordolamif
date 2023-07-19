import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { GRAPHQL_API_URL, WEBSOCKET_URL } from '@env';
import {
  ApolloClient, HttpLink, InMemoryCache, split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(createClient({
  url: WEBSOCKET_URL as string,
}));

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL as string,
  credentials: 'include',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});
