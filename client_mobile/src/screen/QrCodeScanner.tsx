import React, { useEffect, useState } from 'react';
import {
  Alert, Button, Dimensions, Linking, StyleSheet, Text,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QrCodeScanner() {
  const [hasPermission, setHasPermission] = useState<any>(null);

  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }:{type:string, data:string}) => {
    setScanned(true);
    Alert.alert(
      `Le QRCode "${type}" qui redirige vers ${data} a bien été scanné`,
      'Merci de patienter',
      [
        { text: 'OK', onPress: () => Linking.openURL(`${data}`) },
        // eslint-disable-next-line
        { text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (

    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      style={styles.camera}
    >
      <Text style={styles.text}>
        scannez le QR code pour générer votre ticket
      </Text>
      {scanned
        && (
        <Button
          title="Tap to Scan Again"
          onPress={() => setScanned(false)}
        />
        )}
    </BarCodeScanner>
  );
}

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width,
    height,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 30,
    width: '80%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
