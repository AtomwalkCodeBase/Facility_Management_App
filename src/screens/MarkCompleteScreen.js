import React, { useEffect, useState } from 'react';
import { View, Dimensions, TextInput, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { getActivitiQcData, postActivtyInventory } from '../services/productServices';
import SubmitButton from '../components/SubmitButton';
import { colors } from '../Styles/appStyle';
import ErrorModal from '../components/ErrorModal';

const { width, height } = Dimensions.get('window');

// Styled Components
const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
`;

const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})`
  flex: 1;
  padding: 20px;
  padding-bottom: 40px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const BoldText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 5px;
`;

const TextInputStyled = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  font-size: 14px;
  width: 100%;
`;

const ActionButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background-color: ${colors.primary};
  padding: 12px 18px;
  border-radius: 6px;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex: 1;
`;


const ButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const CheckboxLabel = styled.Text`
  margin-left: 8px;
  font-size: 14px;
  color: #555;
`;

// Main Component
const MarkCompleteScreen = (props) => {
  const id = props.id;
  const navigation = useNavigation();
  const [qcData, setQcData] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    fetchQcData();
  }, []);

  const data = {
    activity_id: id,
    call_mode: 'QC_DATA',
  };

  const handleBackPress = () => {
    navigation.goBack();
};

  const fetchQcData = async () => {
    try {
      const response = await getActivitiQcData(data);
      setQcData(response.data);
      setIsCompleted(response.data.isCompleted || false);
    } catch (error) {
      console.error('Error fetching QC data:', error);
    }
  };

  const handleMarkAsCompleted = async () => {
    // Check if any qc_actual value is empty
    const incompleteQcData = qcData.filter(item => !item.qc_actual);
  
    if (incompleteQcData.length > 0) {
      setErrorMessage('Please update all the required QC data before marking the activity as complete.');
      setErrorModalVisible(true);
      return;
    }
  
    const payload = {
      activity_id: id,
      call_mode: 'MARK_COMPLETE',
    };
  
    try {
      const res = await postActivtyInventory(payload);
      Alert.alert('Success', 'Activity Completed Successfully');
      handleBackPress();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update Activity. Please try again later.');
      setErrorModalVisible(true);
    }
  };
  

  console.log('Qc data--',qcData)


  return (
    <GradientBackground>
      <HeaderComponent headerTitle="Mark Activity Complete" onBackPress={navigation.goBack} />
      <ButtonContainer>
        <Container>
          {qcData.map((item, index) => (
            <Card key={index}>
              <BoldText>{item.qc_name}</BoldText>
              <SubText>Permissible Value: {item.qc_value}</SubText>
              {item.qc_actual ? (
                <SubText>QC Actual: {item.qc_actual}</SubText>
              ) : (
                <SubText style={{ color: 'red' }}>QC Actual: Not Provided</SubText>
              )}
            </Card>
          ))}
        </Container>
        <ActionButton onPress={handleMarkAsCompleted}>
          <ButtonText>{isCompleted ? 'Unmark as Completed' : 'Mark as Completed'}</ButtonText>
        </ActionButton>
      </ButtonContainer>
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </GradientBackground>
  );
  
    
};

export default MarkCompleteScreen;
