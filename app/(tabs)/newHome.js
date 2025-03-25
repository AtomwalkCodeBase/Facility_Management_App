import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import NewHomeScreen from '../../src/screens/NewHomeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const newHome = () => {
  return (
	// <SafeAreaView>
	<>
	<StatusBar barStyle="light-content" backgroundColor="#6A1B9A" />
	<NewHomeScreen />
	</>
	// </SafeAreaView>
  )
}

export default newHome