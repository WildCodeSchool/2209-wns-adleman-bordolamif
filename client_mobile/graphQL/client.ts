import Constants from 'expo-constants';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const env = Constants.expoConfig?.extra || {};

// https://wwww.appolographql.com/docs/react/networking/authentication/#cookie
export default new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
  link: createHttpLink({
    uri: env.GRAPHQL_API_URL as string,
    credentials: 'include',
  }),
});
