import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Ensure this is the correct import for your project
import ActivityScreen from '../../src/screens/AllActivity';

const Index = () => {
  const { ref_num } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ActivityScreen data="ALL" id={ref_num} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
