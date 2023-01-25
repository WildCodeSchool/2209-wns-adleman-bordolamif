import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>LET'S GO</Text>
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
    color: 'red',
    backgroundColor: 'yellow',
    fontSize: 50,
    height: 80,
    width: 300,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
  },
});
