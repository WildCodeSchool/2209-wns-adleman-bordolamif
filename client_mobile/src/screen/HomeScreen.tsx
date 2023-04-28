import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ImageBackground, Pressable, Text, View,
} from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: NavigationProps) {
  return (
    <View>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View className="w-full h-full bg-black opacity-70 absolute" />
        <Text className="text-white font-bold text-5xl mt-32 ml-8">Bienvenue sur</Text>
        <View className="flex flex-row ml-8">
          <Text className="text-white font-bold text-6xl">Wait</Text>
          <Text className="text-orange-500 text-6xl">it</Text>
          <Text className="text-white text-6xl">.</Text>

        </View>
        <View className="flex flex-col ml-8 mr-8 mt-10">
          <Text className="text-xl text-white">
            Grâce à l'application, générez votre e-ticket en scannant l'un des QR code
            disposés dans la salle d'attente.
          </Text>
          <Text className="text-xl text-white mt-2">
            Appuyez dès maintenant sur le
            bouton et découvrez Waitit !
          </Text>
        </View>
        <View className="flex justify-center items-center">
          <Pressable
            className="flex rounded-3xl items-center bg-white w-80 active:scale-95 transfo mt-36"
            onPress={() => navigation.navigate('QrCodeScanner')}
          >
            <Text style={{ textAlignVertical: 'center' }} className="text-4xl font-bold py-5 text-orange-500">C'est parti !</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
