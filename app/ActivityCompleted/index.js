import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActivityScreen from '../../src/screens/AllActivity'

const index = () => {

  return (
    <View style={{ flex: 1}}>
          {/* <AllActivity/> */}
          {/* <CompletedActivity/> */}
      <ActivityScreen data="Completed"/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})