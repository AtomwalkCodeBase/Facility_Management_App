import { View, Text } from 'react-native'
import React from 'react'
import TaskScreen from '../../src/screens/TaskScreen'

const task = () => {
  return (
	<View style={{ flex: 1}}>
		<TaskScreen />
	</View>
  )
}

export default task