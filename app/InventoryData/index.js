import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router'; // Use useLocalSearchParams
import InventoryUpdate from '../../src/screens/InventoryUpdate'

const Index = () => {
    const { ref_num, ref_type } = useLocalSearchParams(); // Retrieve the parameter
  
    // console.log('Ref Num===',{ref_num})
    // console.log("Ref type===",{ref_type})

    return (
    <View style={{ flex: 1}}>
          {/* <AllActivity/> */}
          <InventoryUpdate id={ref_num} type={ref_type}/>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({});
