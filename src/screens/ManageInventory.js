import React from 'react';
import { Dimensions, StyleSheet, View, ImageBackground, Text } from 'react-native';
import styled from 'styled-components/native';
import InfoCard from '../components/InfoCard';
import { useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const BackgroundImage = styled.View`

  flex: 1;
  resize-mode: cover;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 20px 0;
  width: 100%;
`;

const GradientOverlay = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.8); /* Subtle overlay for readability */
  justify-content: center;
  align-items: center;
`;

const ManageInventory = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleButtonPress = (route) => {
    router.push({ pathname: route });
  };

  return (
    <Container>
      <HeaderComponent headerTitle="Manage Inventory" onBackPress={handleBackPress} />
      <BackgroundImage>
        <GradientOverlay>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Manage Your Inventory</Text>
          </View>
          <ButtonRow>
            <InfoCard
              number="Add"
              label="Item"
              iconName="plus-circle-multiple"
              gradientColors={['#007bff', '#00c6ff']}
              onPress={() => handleButtonPress('AddInventory')}
            />
            <InfoCard
              number="Process"
              label="Item"
              iconName="check-circle"
              gradientColors={['#38ef7d', '#11998e']}
              onPress={() => handleButtonPress('ProcessInventory')}
            />
          </ButtonRow>
          <ButtonRow>
            <InfoCard
              number="View"
              label="Inventory"
              iconName="eye"
              gradientColors={['#f7971e', '#ffd200']}
              onPress={() => handleButtonPress('ViewInventory')}
            />
            <InfoCard
              number="Reports"
              label="Stats"
              iconName="chart-line"
              gradientColors={['#8e44ad', '#c0392b']}
              onPress={() => handleButtonPress('Reports')}
            />
          </ButtonRow>
        </GradientOverlay>
      </BackgroundImage>
    </Container>
  );
};

export default ManageInventory;

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
