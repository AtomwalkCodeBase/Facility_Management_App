import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ActivityScreen from '../../src/screens/AllActivity';
import ManagerActivityScreen from '../../src/screens/ManagerActivityScreen';
import { getProfileInfo } from '../../src/services/authServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';

const Activity = () => {
  const params = useLocalSearchParams(); // Get search params from URL
  const [callType, setCallType] = useState(params.call_type || 'PROJECT'); // Default to 'PROJECT'

  const [isManager, setIsManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setCallType(params.call_type || 'PROJECT'); // Refresh callType each time page is entered
    }, [params.call_type])
  );

  useEffect(() => {
    getProfileInfo()
      .then((res) => {
        setProfile(res.data);
        setIsManager(res?.data?.user_group?.is_manager || false);
        setIsAdmin(res?.data?.user_group?.is_admin || false);
        setIsOwner(res?.data?.user_group?.is_owner || false);
        setUser(res?.data?.user_name);
      })
      .catch(() => {
        setIsManager(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // console.log('Profile==', user);

  return (
    <View style={{ flex: 1 }}>
      {(isManager || isAdmin || isOwner) ? (
        <ManagerActivityScreen activityType={callType} setCallType={setCallType} user={user} />
      ) : (
        <ActivityScreen data="PENDING" />
      )}
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({});
