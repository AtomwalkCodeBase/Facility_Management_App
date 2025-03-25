import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, Animated, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { getCompanyInfo, getProfileInfo } from '../services/authServices';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { getActivityList, getUserTasks } from '../services/productServices';
import Loader from '../components/old_components/Loader';
import BottomSheetModal from '../components/BottomSheetModal';
import { Feather } from '@expo/vector-icons';
import SwipeableTaskCard from '../components/SwipeableTaskCard';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width } = Dimensions.get('window');


const Container = styled.View`
  background-color: #f5f5f5;
`;

const GradientBackground = styled(LinearGradient).attrs((props) => ({
  colors: ['#6a11cb', '#2575fc'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  align-items: center;
  height: 100%;
`;

const CompanyContainer = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 20px;
  background-color: #6A1B9A;
  align-items: center;
  gap: 20px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  elevation: 5;
`;

const CompanyTextContainer = styled.View`
  display: flex;
  align-items: flex-start;
`;

const CompanyName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  color: #ffffff;
`;

const SubHeader = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  color: #ffffff;
`;

const LogoContainer = styled.View`
  width: ${width * 0.2}px;
  height: ${width * 0.2}px;
  background-color: #ffffff;
  border-radius: ${width * 0.25}px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  margin-top: 5%;
  elevation: 5;
`;

const Logo = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: 95%;
  height: 95%;
  border-radius: ${width * 0.35}px;
`;

const ProfileTextContainer = styled.View`
  display: flex;
  align-items: center;
  padding-top: 20px;
`;

const TaskHeader = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

const TaskListContainer = styled.View`
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #ffffff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  elevation: 5;
`;

const FilterButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 25px;
  border: 1px solid #454545;
  margin-bottom: 10px;
  margin-horizontal: 10px;
`;

const FilterButtonText = styled.Text`
  font-size: 16px;
  color: #454545;
  margin-left: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 10px;
`;

const HomePage = ({ navigation }) => {
  const route = useRoute();
  const { userToken } = useContext(AppContext);
  const [company, setCompany] = useState({});
  const [profile, setProfile] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      fetchTasks(selectedIndex);
    }
  }, [route?.params?.refresh]);

  useEffect(() => {
    console.log("Date Modal Visible:", isDateModalVisible);
  }, [isDateModalVisible]);
  

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companyRes, profileRes, activityRes] = await Promise.all([
        getCompanyInfo(),
        getProfileInfo(),
        getActivityList(),
      ]);
      setCompany(companyRes.data);
      setProfile(profileRes.data);
      setActivities(activityRes.data?.a_list || []);
      fetchTasks(selectedIndex);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    }
    setLoading(false);
  };

  const fetchTasks = async (index) => {
    if (!route?.name) return;

    let taskType = 'ALL'; // Default case

    if (index === 0) taskType = route.name === 'MTaskScreen' ? 'MANAGER_M0' : 'D0'; // Today
    else if (index === 1) taskType = route.name === 'MTaskScreen' ? 'MANAGER_M3' : 'D3'; // Next 3 Days
    else if (index === 2) taskType = route.name === 'MTaskScreen' ? 'MANAGER_PAST' : 'PAST'; // Past Tasks
    else if (index === 3) taskType = route.name === 'MTaskScreen' ? 'MANAGER_ALL' : 'ALL'; // All Tasks

    setLoading(true);
    try {
      const res = await getUserTasks(taskType, '', '');
      // Map the API response to match the expected task structure
      const mappedTasks = res.data.map(task => ({
        id: task.id.toString(),
        title: task.name || "Untitled Task",
        description: task.remarks || "",
        taskDate: task.task_date || "N/A",
        endDate: task.task_date || "N/A",
        time: `${task.start_time} - ${task.end_time }`|| "",
        startTime: task.start_time || "",
        endTime: task.end_time || "",
        status: task.task_status || "Pending",
        priority: task.priority === "01" ? "High" : task.priority === "02" ? "Medium" : "Low",
        taskType: task.task_type_display || task.task_type || "General",
        customer: task.customer?.name || "No Customer",
        assignedTo: task.curr_user?.user_nick_name || task.curr_user?.user_name || "Unassigned",
        owner: task.owner?.user_nick_name || task.owner?.user_name || "No Owner",
        originalData: task // Keep original data for reference
      }));
      setFilterData(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to fetch tasks. Please try again later.');
    }
    setLoading(false);
  };

  const handleSelectTaskType = (selectedOption) => {
    let newIndex = 0; // Default to 'TODAY'

    if (selectedOption === 'NEXT 3') newIndex = 1;
    else if (selectedOption === 'PAST') newIndex = 2;
    else if (selectedOption === 'ALL') newIndex = 3;

    setSelectedIndex(newIndex);
    fetchTasks(newIndex);
    setDateModalVisible(false);
  };

  const handleSelectStatus = (status) => {
    if (status === 'ALL') {
      fetchTasks(selectedIndex);
    } else {
      const filteredTasks = filterData.filter((task) => task.status === status);
      setFilterData(filteredTasks);
    }
    setStatusModalVisible(false);
  };

  const handleMarkAsCompleted = async (taskId) => {
    try {
      // Here you would typically call an API to mark the task as completed
      // For now, we'll update the status in the local state
      setFilterData(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: "Completed" } 
            : task
        )
      );
      Alert.alert('Success', 'Task marked as completed');
    } catch (error) {
      console.error('Error marking task as complete:', error);
      Alert.alert('Error', 'Failed to mark task as complete');
    }
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />
      <GradientBackground>
        <Loader visible={loading} />
        <CompanyContainer>
          <LogoContainer>
            <Logo source={{ uri: company.image || 'https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png' }} />
          </LogoContainer>
          <CompanyTextContainer>
            <CompanyName>{company.name || 'Atomwalk Technologies'}</CompanyName>
            <SubHeader>Welcome to Atomwalk Office!</SubHeader>
          </CompanyTextContainer>
        </CompanyContainer>

        <ProfileTextContainer>
          <TaskHeader>My Tasks</TaskHeader>
        </ProfileTextContainer>

        <ButtonContainer>
        <FilterButton onPress={() => {
          console.log("Opening Date Filter Modal");
          setDateModalVisible(true);
        }}>
          <Feather name="calendar" size={20} color="#454545" />
          <FilterButtonText>Filter by Day</FilterButtonText>
        </FilterButton>
        
          <FilterButton onPress={() => setStatusModalVisible(true)}>
            <Feather name="filter" size={20} color="#454545" />
            <FilterButtonText>Filter by Status</FilterButtonText>
          </FilterButton>
        </ButtonContainer>

        

        <TaskListContainer>
          <GestureHandlerRootView style={styles.listContainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <FlatList
                data={filterData}
                renderItem={({ item }) => (
                  <SwipeableTaskCard
                    task={item}
                    onMarkComplete={handleMarkAsCompleted}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            </Animated.View>
          </GestureHandlerRootView>
        </TaskListContainer>
      </GradientBackground>

      {isDateModalVisible && (
        <BottomSheetModal
          key={isDateModalVisible}
          visible={isDateModalVisible}
          options={['TODAY', 'NEXT 3', 'PAST', 'ALL']}
          onSelect={handleSelectTaskType}
          onClose={() => setDateModalVisible(false)}
        />
      )}
      

      <BottomSheetModal
        visible={isStatusModalVisible}
        options={['Planned', 'Completed', 'Not Planned', 'ALL']}
        onSelect={handleSelectStatus}
        onClose={() => setStatusModalVisible(false)}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomePage;