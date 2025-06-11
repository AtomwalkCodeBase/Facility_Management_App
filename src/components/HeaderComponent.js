import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons"; // For the back arrow icon

// Styled Components for the Header
const HeaderContainer = styled(SafeAreaView)`
  background-color: #fff;
  padding-bottom: 10px;
  padding-horizontal: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #E0E0E0;
  padding-top: 40px;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 5px;
`;

const HeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color:  #333;
  flex: 1;
  padding-horizontal: 10px;
  text-align: center;
`;

const PlaceholderView = styled(View)`
  width: 30px; 
`;

// HeaderComponent
const HeaderComponent = ({ headerTitle, onBackPress }) => {
  return (
    <HeaderContainer>
      {/* Back Button */}
      <BackButton onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </BackButton>

      {/* Title */}
      <HeaderTitle>{headerTitle}</HeaderTitle>

      {/* Placeholder to balance the layout and keep the title centered */}
      <PlaceholderView />
    </HeaderContainer>
  );
};

export default HeaderComponent;