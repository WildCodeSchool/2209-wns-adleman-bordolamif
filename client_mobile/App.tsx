import HomeScreen from './src/screen/HomeScreen';
import ServicesSelectionScreen from './src/screen/ServicesSelectionScreen';
import QrCodeScanner from './src/screen/QrCodeScanner';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/RootStackParamList';
import { ApolloProvider } from '@apollo/client';
import client from './graphQL/client';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={DefaultTheme}>
        <StatusBar barStyle="light-content" backgroundColor="#f97316" />
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="QrCodeScanner" component={QrCodeScanner} />
          <Stack.Screen name="ServicesSelectionScreen" component={ServicesSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
