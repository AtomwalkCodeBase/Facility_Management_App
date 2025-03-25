import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

const ClaimCardContainer = styled.TouchableOpacity`
  background-color: #F9F5FA;
  border-radius: 12px;
  border-width: 1px;
  border-color: #B836F2;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ClaimText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ClaimTextTitle = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  font-weight: bold;
`;

const ClaimAmountContainer = styled.View`
  position: absolute;
  right: 16px;
  top: 16px;
  background-color: #fff5e6;
  padding: 4px 8px;
  border-radius: 8px;
`;

const ClaimAmountText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #ff8800;
`;

const ViewButton = styled(TouchableOpacity)`
  background-color: #fff;
  border: 1px solid #4d88ff;
  border-radius: 24px;
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: 12px;
`;

const ViewButtonText = styled.Text`
  color: #4d88ff;
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
`;

const ClaimCard = ({ claim, onPress, onViewFile, getStatusText }) => (
  <ClaimCardContainer onPress={() => onPress(claim)}>
    <View>
      <ClaimTextTitle>{claim.claim_id}</ClaimTextTitle>
      <ClaimText>Item Name: {claim.item_name}</ClaimText>
      <ClaimText>Expense Date: {claim.expense_date}</ClaimText>
      <ClaimText>Status: {getStatusText(claim.expense_status)}</ClaimText>
      {claim.approved_by && <ClaimText>Approved By: {claim.approved_by}</ClaimText>}
    </View>
    <ClaimAmountContainer>
      <ClaimAmountText>₹ {claim.expense_amt}</ClaimAmountText>
    </ClaimAmountContainer>
    {claim.submitted_file_1 && (
      <ViewButton onPress={() => onViewFile(claim.submitted_file_1)}>
        <MaterialIcons name="visibility" size={20} color="#4d88ff" />
        <ViewButtonText>View File</ViewButtonText>
      </ViewButton>
    )}
  </ClaimCardContainer>
);

export default ClaimCard;
