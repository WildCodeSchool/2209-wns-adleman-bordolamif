import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: NavigationProps) {
  return (
    <View className="">
      <Text className="text-red-600 text-5xl">En construction</Text>
      <View style={{ marginBottom: 20 }}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </View>
      <Button
        title="Go to QrCodeScanner"
        onPress={() => navigation.navigate('QrCodeScanner')}
      />
      <StatusBar style="auto" />
    </View>
  );
}
