import { StatusBar } from 'expo-status-bar';
import {
  Button, StyleSheet, Text, View,
} from 'react-native';

// eslint-disable-next-line
export default function HomeScreen({ navigation } : {navigation: any}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>En construction</Text>
      <Button
        title="Go to QrCodeScanner"
        onPress={() => navigation.navigate('QrCodeScanner')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 50,
    height: 80,
    width: 300,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
  },
});
