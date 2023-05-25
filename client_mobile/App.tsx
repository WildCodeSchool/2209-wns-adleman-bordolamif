import HomeScreen from './src/screen/HomeScreen';
import ServicesSelectionScreen from './src/screen/ServicesSelectionScreen';
import QrCodeScanner from './src/screen/QrCodeScanner';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/RootStackParamList';
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split,
} from '@apollo/client';
import { StatusBar } from 'react-native';
import TicketScreen from './src/screen/TicketScreen';
import * as Notifications from 'expo-notifications';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { GRAPHQL_API_URL, WEBSOCKET_URL } from '@env';

const Stack = createNativeStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={DefaultTheme}>
        <StatusBar hidden />
        <Stack.Navigator
          screenOptions={{ headerShown: false, navigationBarHidden: true }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="QrCodeScanner" component={QrCodeScanner} />
          <Stack.Screen name="ServicesSelectionScreen" component={ServicesSelectionScreen} />
          <Stack.Screen name="TicketScreen" component={TicketScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
