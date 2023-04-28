import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Button, Alert, Linking,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QrCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // eslint-disable-next-line no-alert
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
    <View style={styles.container}>
      <Text style={styles.text}>
        Merci de prendre en photo le QR code affiché sur la borne de sélection
      </Text>
      <View style={styles.camera}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned
        && (
        <Button
          title="Tap to Scan Again"
          onPress={() => setScanned(false)}
        />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    color: '#000',
    fontSize: 30,
    marginTop: 30,
    width: '80%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
