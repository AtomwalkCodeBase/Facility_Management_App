import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Keyboard, SafeAreaView, Dimensions, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getInventoryItem, processItemSrl } from '../services/productServices';
import HeaderComponent from '../components/HeaderComponent';
import DropdownPicker from '../components/DropdownPicker';
import AmountInput from '../components/AmountInput';
import SubmitButton from '../components/SubmitButton';
import Loader from '../components/old_components/Loader';
import styled from 'styled-components/native';
import { colors } from '../Styles/appStyle';
import SuccessModal from '../components/SuccessModal';

const { width } = Dimensions.get('window');

const Container = styled.ScrollView`
  flex: 1;
  padding: 10px;
  background-color: #fff;
`;

const AddInventoryItem = () => {
  const [amount, setAmount] = useState("");
  const [claimItem, setClaimItem] = useState([]);
  const [item, setItem] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const call_mode = 'ITEM_NEW';

  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params?.item) {
      fetchItemList(params?.item);
    }
    else{
      fetchItemList();
    }
    if (params?.quantyti) {
      setAmount(params?.quantyti);
    }
  }, [params?.quantyti, params?.item]); 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // useEffect(() => {
  //   fetchItemList();
  // }, []);

  const fetchItemList = async (selectedItemId) => {
    setIsLoading(true);
    try {
      const response = await getInventoryItem();
      const formattedData = response.data.map((item) => ({
        label: item.name,  
        value: item.id,    
      }));
  

      setClaimItem(formattedData);

      if (selectedItemId) {
        const selectedItem = formattedData.find((item) => String(item.value) === String(selectedItemId));
        if (selectedItem) {
          setItem(selectedItem.value);
         
        } else {
          console.warn('Selected item ID not found in the list.');
        }
      }
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!item) {
      handleError('Please select an Inventory Item', 'item');
      isValid = false;
    }

    if (!amount) {
      handleError('Please enter the quantity', 'amount');
      isValid = false;
    }

    if (isValid) {
      handlePressScanQR(amount);
    }
  };

  const handlePressScanQR = (amount) => {
    router.push({
      pathname: 'QrScanner',
      params: { quantity: amount, item: item },
    });
  };

  const addItemInventory = () => {
    const itemPayload = {
      item_id: `${item}`,
      in_quantity: amount,
      mfg_batch_number: '0001',
      item_srl_num_list: scannedCodes,
      call_mode,
    };

    console.log('Payload',itemPayload)

    processItemSrl(itemPayload)
      .then(() => {
        setIsLoading(false);
        setIsSuccessModalVisible(true);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert(
          'Item Unable to add',
          `Failed to add: ${error.response?.data?.detail || error.message}`
        );
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (params.scannedCodes) {
        try {
          const parsedCodes = JSON.parse(params.scannedCodes);
          setScannedCodes(Array.isArray(parsedCodes) ? parsedCodes : []);
        } catch (error) {
          console.error('Failed to parse scanned codes:', error);
          setScannedCodes([]);
        }
      } else {
        setScannedCodes([]);
      }
    }, [params.scannedCodes])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderComponent headerTitle="Register Inventory" onBackPress={handleBackPress} />
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <Container>
          <DropdownPicker
            label="Inventory"
            data={claimItem}
            value={item}
            setValue={setItem}
            error={errors.item}
          />

          <AmountInput
            claimAmount={amount}
            value={amount}
            label="Enter Quantity"
            setClaimAmount={setAmount}
          />

          {scannedCodes.length > 0 && (
            <Container>
              <Text>Scanned Codes:</Text>
              {scannedCodes.map((code, index) => (
                <Text key={index}>{`Serial: ${code.item_serial_num}, MFG: ${code.mfg_item_serial_num}, Remarks: ${code.remarks}`}</Text>
              ))}
            </Container>
          )}

          <SubmitButton
            label={scannedCodes.length > 0 ? "Submit Claim" : "Scan QR"}
            onPress={scannedCodes.length > 0 ? addItemInventory : validate}
            bgColor={colors.primary}
            textColor="white"
          />
        </Container>
      )}
      <SuccessModal 
        visible={isSuccessModalVisible} 
        onClose={() => {
          setIsSuccessModalVisible(false);
          navigation.goBack();
        }} 
      />
    </SafeAreaView>
  );
};

export default AddInventoryItem;
