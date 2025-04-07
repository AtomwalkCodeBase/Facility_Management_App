import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import HomeScreen from '../../src/screens/HomeScreen';
import PinPopup from '../../src/screens/PinPopup';
import { getProfileInfo } from '../../src/services/authServices';
import ManagerHomePage from '../../src/screens/ManagerHomeScreen';
import { Text } from 'react-native';
import NewHomeScreen from '../../src/screens/NewHomeScreen';
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  const [isManager, setIsManager] = useState(false);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileInfo()
      .then((res) => {
        setProfile(res.data);
        setIsManager(res?.data?.user_group?.is_manager || false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setIsManager(false);
      });
  }, []);

  return (
    <>
      {/* {isManager ? <ManagerHomePage /> : <HomeScreen />} */}
      <HomeScreen />
      
	{/* <NewHomeScreen /> */}
      <PinPopup />
    </>
  );
};

export default Home;
