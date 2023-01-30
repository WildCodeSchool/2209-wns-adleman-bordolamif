import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {
  Button, StyleSheet, Text, View,
} from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: NavigationProps) {
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
    fontSize: 50,
    height: 80,
    width: 300,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
  },
});
