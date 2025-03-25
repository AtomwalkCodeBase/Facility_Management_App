import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../../context/AppContext';
import { getProfileInfo } from '../services/authServices';
import { useNavigation, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRModal from '../components/QRModal';
import HeaderComponent from '../components/HeaderComponent';
import Loader from '../components/old_components/Loader';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const { logout } = useContext(AppContext);
  const [profile, setProfile] = useState({});
  const [userGroup, setUserGroup] = useState({});
  const [userPin, setUserPin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await getProfileInfo();
        setProfile(res?.data);
        setUserGroup(res.data?.user_group);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserPin = async () => {
      const storedPin = await AsyncStorage.getItem('userPin');
      setUserPin(storedPin);
    };

    fetchProfile();
    fetchUserPin();
  }, []);

  const handleBackPress = () => navigation.goBack();
  const handlePressPassword = () => router.push({ pathname: 'ResetPassword' });
  const handleQRPress = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  console.log('Prf====',profile.user_name)


  return (
    <>
      <HeaderComponent headerTitle="My Profile" onBackPress={handleBackPress} />
      {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
      <ScrollView contentContainerStyle={styles.container}>
        {/* QR Button */}
        <TouchableOpacity style={styles.qrButton} onPress={handleQRPress}>
          <MaterialCommunityIcons name="qrcode" size={28} color="#00796b" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Animated.View
            style={styles.avatarContainer}
            entering={FadeIn.duration(700)}
            exiting={FadeOut.duration(500)}
          >
            <Image source={{ uri: profile?.image }} style={styles.profileImage} />
          </Animated.View>

          
          {profile?.emp_data?.name && (
            <Text style={styles.userName}>{profile?.emp_data?.name}</Text>
          )}
          {profile?.user_name && (
            <Text style={styles.userId}>{profile.user_name}</Text>
          )}
          
          <Text style={styles.userRole}>{userGroup?.name || 'Employee'}</Text>
        </View>

        {/* Details Section */}
        {profile?.emp_data?.emp_id && (
        <View style={styles.detailsContainer}>
            <InfoRow icon="badge-account-horizontal" text={`Employee ID: ${profile?.emp_data?.emp_id}`} />
        </View>
        )}

        {profile?.emp_data?.department_name && (
        <View style={styles.detailsContainer}>
            <InfoRow icon="office-building" text={`Department: ${profile?.emp_data?.department_name}`} />
        </View>
        )}

        {profile?.mobile_number && (
        <View style={styles.detailsContainer}>
            <InfoRow icon="phone" text={`Mobile: ${profile?.mobile_number}`} />
          
        </View>
        )}

        {/* Actions */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.pinButton} onPress={handlePressPassword}>
            <Text style={styles.pinText}>{userPin ? 'Update Your Pin' : 'Set Your Pin'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} 
          onPress={async () => {
                                await AsyncStorage.removeItem('userPin');
                                await AsyncStorage.removeItem('authToken');  // Add other keys if needed
                                logout();
                              }}>
            <MaterialCommunityIcons name="logout" size={24} color="#d9534f" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* QR Modal */}
        <QRModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          qrValue={profile?.emp_data?.emp_id || 'No Image Available'}
        />
      </ScrollView>
)}
    </>
  );
};

// Reusable Row Component for Info
const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={22} color="#555" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05,
    alignItems: 'center',
  },
  infocontainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05,
    alignItems: 'center',
  },
  qrButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 25,
    elevation: 3,
    zIndex: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.02,
  },
  avatarContainer: {
    backgroundColor: '#e8f0fe',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 6,
  },
  profileImage: {
    width: '92%',
    height: '92%',
    borderRadius: (width * 0.3) / 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    marginBottom: 15,
  },
  userId: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    marginBottom: 5,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f5f7fa',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  pinButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  pinText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    elevation: 4,
  },
  logoutText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
