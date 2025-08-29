import React, { useEffect, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, Image, SafeAreaView, Linking  } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams } from 'expo-router';
import HeaderComponent from './HeaderComponent';
import ImageView from 'react-native-image-viewing';
import SuccessModal from './SuccessModal';
// Styled Components
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const QRContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  elevation: 10;
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff5c5c;
  border-radius: 10px;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const ImageMOdal = ({ isVisible, onClose, qrValue }) => {
  const { item } = useLocalSearchParams();
  const [isImage, setIsImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (qrValue) {
      const fileExtension = qrValue.split('.').pop().split('?')[0].toLowerCase();
      setIsImage(['jpg', 'jpeg', 'png'].includes(fileExtension));

      if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        // Handle other files
        setSuccessMessage("The file is being downloaded")
        setModalOpen(true);
        Linking.openURL(qrValue).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        onClose?.(); // close modal since it's not an image
      }
    }
  }, [qrValue]);

  if (!isImage) return null; // nothing to render if not an image

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ImageView
          images={[{ uri: qrValue }]}
          imageIndex={0}
          visible={isVisible}
          onRequestClose={onClose}
          presentationStyle="overFullScreen"
        />
      </View>
      <SuccessModal
      visible={modalOpen}
      message={successMessage}
      onClose={() => setModalOpen(false)}
      />
    </SafeAreaView>
  );
};


export default ImageMOdal;
