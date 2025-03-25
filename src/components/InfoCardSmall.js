import React from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';

// InfoCard container with shadow and gradient background
const InfoCardContainer = styled(LinearGradient).attrs((props) => ({
  colors: props.colors || ['#ffffff', '#ffffff'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  width: 100px;
  padding: 2px;
  height: 100px;
  margin: 8px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  elevation: 4; /* Shadow for Android */
  shadow-color: #000; /* Shadow for iOS */
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

// Text Components
const NumberText = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
`;

const LabelText = styled.Text`
  font-size: 13px;
  color: #ffffff;
  margin-top: 4px;
  font-weight: 600;
  flex-wrap: wrap;
`;

// InfoCard Component
const InfoCardSmall = ({ number, label, gradientColors, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <InfoCardContainer colors={gradientColors}>
      <NumberText>{number}</NumberText>
      <LabelText>{label}</LabelText>
    </InfoCardContainer>
  </TouchableOpacity>
);

export default InfoCardSmall;
