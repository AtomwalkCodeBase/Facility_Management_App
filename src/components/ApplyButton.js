import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const ApplyClaimButtonContainer = styled.TouchableOpacity`
  background-color: #4d88ff;
  padding: ${Platform.OS === 'ios' ? '12px 16px' : '10px 14px'};
  border-radius: 25px;
  align-self: center;
  margin-bottom: ${width > 400 ? '20px' : '16px'};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${width > 412 ? '90%' : '100%'};
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: ${width > 400 ? '18px' : '16px'};
  font-weight: 600;
  margin-left: 8px;
`;

const ApplyButton = ({ onPress, buttonText, icon }) => (
  <ApplyClaimButtonContainer onPress={onPress}>
    <MaterialIcons name={icon} size={width > 400 ? 26 : 24} color="#fff" />
    <ButtonText>{buttonText}</ButtonText>
  </ApplyClaimButtonContainer>
);

export default ApplyButton;
