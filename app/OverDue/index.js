import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Ensure this is the correct import for your project
import ActivityScreen from '../../src/screens/AllActivity';

const Index = () => {

  return (
    <View style={styles.container}>
      <ActivityScreen data="OverDue"/>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
