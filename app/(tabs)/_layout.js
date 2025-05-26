import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getProfileInfo } from '../../src/services/authServices';
import { FontAwesome5 } from '@expo/vector-icons';

const _layout = () => {
  const [isUser, setIsUser] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileInfo()
      .then((res) => {
        setProfile(res.data);
        const { is_manager, is_admin, is_owner } = res?.data?.user_group || {};
        setIsUser(!(is_manager || is_admin || is_owner));
      })
      .catch(() => {
        setIsUser(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null; // Optionally, add a loading spinner or fallback UI here.
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />

       <Tabs.Screen
        name="task"
        options={{
          title: 'Task',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="tasks" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
