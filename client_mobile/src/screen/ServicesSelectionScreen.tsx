import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Text, View,
} from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'ServicesSelectionScreen'>;

interface Props {
    navigation:NavigationProps,
    waitingRoom:string
}

export default function ServicesSelectionScreen(props:Props) {
  const { waitingRoom, navigation } = props;
  console.error(waitingRoom, navigation);

  return (
    <View>
      <Text>Hello les BG</Text>
    </View>
  );
}
