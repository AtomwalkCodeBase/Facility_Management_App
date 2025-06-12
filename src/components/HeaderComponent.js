import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const HeaderContainer = styled(SafeAreaView)`
  background-color: #fff;
  padding: ${Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20}px 20px 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 5px;
`;

const HeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex: 1;
`;

const HeaderSide = styled(View)`
  width: 30px;
  align-items: center;
  justify-content: center;
`;

// HeaderComponent
const HeaderComponent = ({ headerTitle, onBackPress }) => {
  return (
    <HeaderContainer>
      <HeaderSide>
        <BackButton onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </BackButton>
      </HeaderSide>

      <HeaderTitle>{headerTitle}</HeaderTitle>

      <HeaderSide>{/* Empty but required for layout symmetry */}</HeaderSide>
    </HeaderContainer>
  );
};

export default HeaderComponent;
