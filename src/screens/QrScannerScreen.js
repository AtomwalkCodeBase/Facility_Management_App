import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation, useRouter } from 'expo-router';

export default function QrScannerScreen(props) {
  const navigation = useNavigation();
  const router = useRouter();
  const quantity = props.qantity;
  const item = props.selectedItem;
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isScanning, setIsScanning] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScan, setCurrentScan] = useState('');
  const [mfgItemSerialNum, setMfgItemSerialNum] = useState('');
  const [remarks, setRemarks] = useState('');
  const [scanAnimation] = useState(new Animated.Value(0)); // Added for animation

  console.log('Pass quantity', props.qantity);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    startScanAnimation(); // Start the animation when the component mounts
  }, [hasPermission]);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (
      isScanning &&
      !scannedCodes.find((code) => code.item_serial_num === data)
    ) {
      setCurrentScan(data); // Set the current scanned QR code
      setModalVisible(true); // Open the modal for user input
    }
  };

  const handleSaveDetails = () => {
    const newEntry = {
      item_serial_num: currentScan,
      mfg_item_serial_num: mfgItemSerialNum,
      remarks: remarks,
    };

    const updatedScannedCodes = [...scannedCodes, newEntry];
    setScannedCodes(updatedScannedCodes);
    setModalVisible(false);
    setMfgItemSerialNum('');
    setRemarks('');

    if (updatedScannedCodes.length >= quantity) {
      setIsScanning(false);
      router.replace({
        pathname: 'AddInventory',
        params: {
          scannedCodes: JSON.stringify(updatedScannedCodes),
          quantyti: quantity,
          item: item,
        },
      });
    }
  };

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!hasPermission.granted) {
    return <Text>No access to camera</Text>;
  }

  // Map animation to a translation effect
  const scanLineTranslateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust range based on camera preview height
  });

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent headerTitle="Item Scanner" onBackPress={navigation.goBack} />
      {!modalVisible && (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
          >
            {/* Scan Animation */}
            <View style={styles.scanArea}>
              <Animated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLineTranslateY }] },
                ]}
              />
            </View>
          </CameraView>
        </View>
      )}
      <View style={{ padding: 10 }}>
        <Text>Scanned {scannedCodes.length} of {quantity}</Text>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Details</Text>
            <Text>Scanned QR Code: {currentScan}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter MFG Item Serial Number"
              value={mfgItemSerialNum}
              onChangeText={setMfgItemSerialNum}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Remarks"
              value={remarks}
              onChangeText={setRemarks}
            />
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSaveDetails} />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    margin: 20,
    overflow: 'hidden',
  },
  scanLine: {
    width: '90%',
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
