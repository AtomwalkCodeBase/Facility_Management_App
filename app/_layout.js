import { Stack } from "expo-router";
import {AppProvider} from '../context/AppContext'
import { BackHandler, StatusBar, View } from 'react-native';

if (BackHandler && typeof BackHandler.removeEventListener !== 'function') {
  BackHandler.removeEventListener = () => {};
}

export default function RootLayout() {
  return (
    <AppProvider>
    <StatusBar barStyle="light-content" />
      <View style={styles.statusBarBackground} />
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="AuthScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="PinScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="ResetPassword/index" options={{headerShown:false}}/>
      <Stack.Screen name="ForgetPin/index" options={{headerShown:false}}/>

    </Stack>
    
    </AppProvider>
  );
}

const styles = {
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight,
    backgroundColor: '#4A6FA5', // Your status bar color
    zIndex: 1,
  }
};
