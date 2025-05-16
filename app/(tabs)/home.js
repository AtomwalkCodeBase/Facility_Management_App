import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import HomeScreen from '../../src/screens/HomeScreen';
import PinPopup from '../../src/screens/PinPopup';
import { getProfileInfo } from '../../src/services/authServices';

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
<SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
      
      </SafeAreaView>

  );
};

export default Home;
    // <SafeAreaView style={{ flex: 1 }}>
      // <PinPopup />
      {/* {isManager ? <ManagerHomePage /> : <HomeScreen />} */}
      	{/* <NewHomeScreen /> */}
  // </SafeAreaView>