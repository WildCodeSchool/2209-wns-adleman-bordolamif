import React, { useEffect, useState } from 'react';
import {
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';
import BarCodeScannerLens from '../components/BarCodeScannerLens';

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

    return navigation.navigate('ServicesSelectionScreen', { waitingRoomId: data });
  };

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={[StyleSheet.absoluteFillObject, styles.container]}
    >
      <Pressable
        className="ml-6 mt-14"
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={28} color="white" />
      </Pressable>
      <BarCodeScannerLens />
      {scanned
        && (
        <Pressable
          className="border-white border-2 rounded-xl mx-auto w-2/3"
          onPress={() => setScanned(false)}
        >
          <Text className="py-4 text-white text-center text-xl">Appuyer pour scanner à nouveau</Text>
        </Pressable>
        )}
      {hasPermission === null
          && <Text style={styles.alertText}>Demande d'autorisation d'accées à la caméra</Text>}
      {!hasPermission
          && <Text style={styles.alertText}>L'application n'a pas accées à la caméra</Text>}
      <View
        className="absolute flex flex-row justify-center w-full"
        style={{ top: 650 }}
      >
        <Text className="text-white font-bold text-5xl">Wait</Text>
        <Text className="text-orange-500 text-5xl">it</Text>
      </View>
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
