import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ImageBackground, Pressable, Text, View,
} from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import background from '../../assets/background.jpg';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: NavigationProps) {
  return (
    <View>
      <ImageBackground
        source={background}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={{
          width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.7, position: 'absolute',
        }}
        />
        <Text className="text-white font-bold text-5xl mt-[70%] ml-8">Bienvenue sur</Text>
        <View className="flex flex-row ml-8">
          <Text className="text-white font-bold text-6xl">Wait</Text>
          <Text className="text-orange-500 text-6xl">it</Text>
        </View>
        <View className="flex flex-col ml-8 mr-8 mt-[10%]">
          <Text className="text-xl text-white">
            Vous allez être invité à scanner un de nos QRCodes
            présents dans votre établissement de santé, afin de
            pouvoir récupérer votre ticket pour rejoindre une file d'attente.
          </Text>
        </View>
        <View className="flex justify-center items-center">
          <Pressable
            className="flex rounded-3xl items-center bg-white w-80 active:scale-95 transfo mt-[50%]"
            onPress={() => navigation.navigate('QrCodeScanner')}
          >
            <Text style={{ textAlignVertical: 'center' }} className="text-4xl font-bold py-8 text-orange-500">C'est parti !</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
