import React, { useEffect, useState } from 'react';
import {
  Alert, Pressable, StyleSheet, Text,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';
import BarCodeScannerLens from '../components/BarCodeScannerLens';
import BottomLogo from '../components/BottomLogo';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'QrCodeScanner'>;

export default function QrCodeScanner({ navigation }: NavigationProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data } : { data: string }) => {
    setScanned(true);

    if (!data) {
      return console.warn('No data found');
    }

    if (Number.isNaN(parseInt(data, 10))) {
      Alert.alert(
        'QR code invalide',
        "Merci de scanner le QR code présent dans votre salle d'attente.",
        [
          { text: 'OK', onPress: () => setScanned(false) },
        ],
        { cancelable: false },
      );
      return console.warn('Not a valid qr code');
    }

    return navigation.navigate('ServicesSelectionScreen', { waitingRoomId: data });
  };

  return (
    <BarCodeScanner
      key={scanned ? 1 : 2}
      type={BarCodeScanner.Constants.Type.back}
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={[StyleSheet.absoluteFillObject, styles.container]}
    >
      <Pressable
        className="ml-6 mt-14 flex flex-row items-center"
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={28} color="white" />
        <Text className="text-white text-2xl ml-2">Retour</Text>
      </Pressable>
      <BarCodeScannerLens />
      {scanned
        && (
        <Pressable
          className="border-white border-2 rounded-xl mt-[5vh] mx-auto w-2/3"
          onPress={() => setScanned(false)}
        >
          <Text
            style={{ textAlign: 'center' }}
            className="py-4 text-white f-xl-center"
          >Appuyer pour scanner à nouveau
          </Text>
        </Pressable>
        )}
      {hasPermission === null
          && <Text style={styles.alertText}>Demande d'autorisation d'accées à la caméra</Text>}
      {!hasPermission
          && <Text style={styles.alertText}>L'application n'a pas accées à la caméra</Text>}
      <BottomLogo color="light" />
    </BarCodeScanner>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'black',
  },
  alertText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 10,
  },
});
