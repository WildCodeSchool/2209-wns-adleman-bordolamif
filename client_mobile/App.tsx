import HomeScreen from './src/screen/HomeScreen';
import QrCodeScanner from './src/screen/QrCodeScanner';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/RootStackParamList';
import LoginScreen from './src/screen/LoginScreen';
import { ApolloProvider } from '@apollo/client';
import client from './graphQL/client';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="QrCodeScanner" component={QrCodeScanner} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

// const styles = StyleSheet.create({});
