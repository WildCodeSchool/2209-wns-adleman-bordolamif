import React, { useEffect, useState } from 'react';
import {
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'QrCodeScanner'>;

export default function QrCodeScanner({ navigation }: NavigationProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }:{data:string}) => {
    setScanned(true);
    if (JSON.parse(data)) {
      navigation.navigate('ServicesSelectionScreen', data);
    }
  };

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={[StyleSheet.absoluteFillObject, styles.container]}
    >
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer} className="flex flex-col justify-between">
            <View className="flex flex-row justify-between">
              <View style={styles.borderTopLeft} />
              <View style={styles.borderTopRight} />
            </View>
            <View className="flex flex-row justify-between">
              <View style={styles.borderBottomLeft} />
              <View style={styles.borderBottomRight} />
            </View>
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>
      <Pressable
        className="ml-6 mt-[17%]"
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={32} color="white" />
      </Pressable>
      {scanned
        && (
        <Pressable
          className="border-white border-2 rounded-xl mt-8 mx-auto w-2/3"
          onPress={() => setScanned(false)}
        >
          <Text className="py-4 text-white text-center text-xl">Appuyer pour scanner à nouveau</Text>
        </Pressable>
        )}
      {hasPermission === null && <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 10 }}>Demande d'autorisation d'accées à la caméra</Text>}
      {!hasPermission && <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 10 }}>L'application n'a pas accées à la caméra</Text>}
      <View className="flex flex-row justify-center mt-[172%]">
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  borderTopLeft: {
    borderColor: 'white',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    width: 50,
    height: 50,
  },
  borderTopRight: {
    borderColor: 'white',
    borderTopWidth: 4,
    borderRightWidth: 4,
    width: 50,
    height: 50,
  },
  borderBottomLeft: {
    borderColor: 'white',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    width: 50,
    height: 50,
  },
  borderBottomRight: {
    borderColor: 'white',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    width: 50,
    height: 50,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.4,
  },
  focusedContainer: {
    flex: 12,
  },
});
