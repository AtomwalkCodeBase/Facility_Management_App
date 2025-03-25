import React from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const ModalComponent = ({ isVisible, leave, onClose, claim }) => {
  // console.log("Claim Data",claim)
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <ModalContainer>
        <ModalContent>

          
          {leave ? (
            <>
            <Text>{leave.leave_type_display}</Text>
            <Text>No. of Days: {leave.no_leave_count}</Text>
            <Text>{leave.from_date} to {leave.to_date}</Text>
            <Text>Remark: {leave.remarks}</Text>
            <Text>Status: {leave.status_display}</Text>
            </>
          ) : null}

          {claim ? (
            <>
            <Text style={{ fontWeight: 'bold' }} >{claim.claim_id}</Text>
            <Text>Claim Date: {claim.submitted_date}</Text>
            <Text>Expense Amount: {claim.expense_amt}</Text>
            <Text>Project Name: {claim.project_name}</Text>
            <Text>Remark: {claim.remarks}</Text>
            {/* <Text>Status: {leave.status_display}</Text> */}
            </>
          ) : null}

          <CancelButton onPress={onClose}>
            <Text style={{ color: 'white' }}>Back</Text>
          </CancelButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// Styled Components for Modal
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  align-items: center;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #4491FE;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
`;

export default ModalComponent;
