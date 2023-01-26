import HomeScreen from './src/screen/HomeScreen';
import { ApolloProvider } from '@apollo/client';
import client from './graphQL/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <HomeScreen />
    </ApolloProvider>
  );
}

// const styles = StyleSheet.create({});
