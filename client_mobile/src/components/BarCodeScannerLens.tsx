import { StyleSheet, View } from 'react-native';
import React from 'react';

function BarCodeScannerLens() {
  return (
    <View style={styles.overlay}>
      <View style={styles.unfocusedContainer} />
      <View style={styles.middleContainer}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.focusedContainer} className="f-between">
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
  );
}

const styles = StyleSheet.create({
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
export default BarCodeScannerLens;
