import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Animated,
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AppContext } from "../../context/AppContext";
import { getCompanyInfo, getProfileInfo } from "../services/authServices";
import { StatusBar } from "expo-status-bar";
import {
  getActivityList,
  getUserTasks,
  updateTask,
} from "../services/productServices";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ModalComponent from "../components/ModalComponent";
import Dropdown from "../components/Dropdown";
import NewTaskCard from "../components/NewTaskCard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const dayFilterOptions = ["Today", "Next 3 Days", "Past", "All"];
const statusFilterOptions = ["Planned", "Completed", "Not Planned"];

const HomeScreen = ({ navigation }) => {
  const route = useRoute();
  const { userToken } = useContext(AppContext);
  const [company, setCompany] = useState({});
  const [profile, setProfile] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [selectedDayFilter, setSelectedDayFilter] = useState("Today");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Planned");
  const [tasks, setTasks] = useState([]);

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
      fetchTasks(selectedDayFilter, selectedStatusFilter);
    }
  }, [route?.params?.refresh]);

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
      fetchTasks(selectedDayFilter, selectedStatusFilter);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert(
        "Error",
        "Failed to load app data. Please check your connection and try again."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks(selectedDayFilter, selectedStatusFilter);
  }, [selectedDayFilter, selectedStatusFilter]);

  const fetchTasks = async (dayFilter, statusFilter) => {
    let taskType = "ALL";
    if (dayFilter === "Today") taskType = "D0";
    else if (dayFilter === "Next 3 Days") taskType = "D3";
    else if (dayFilter === "Past") taskType = "PAST";
    else if (dayFilter === "Cancel") taskType = "CANCEL";

    try {
      const res = await getUserTasks(taskType, "", "");
      console.log("Fetched Tasks:", res.data);

      const formattedTasks = res.data
        .map((task) => ({
          id: task.id.toString(),
          title: task.name || "Untitled Task",
          description: task.remarks || "",
          taskDate: task.task_date || "N/A",
          endDate: task.task_date || "N/A",
          time: `${task.start_time} - ${task.end_time}` || "",
          startTime: task.start_time || "",
          endTime: task.end_time || "",
          status: task.task_status || "Pending",
          priority:
            task.priority === "01"
              ? "High"
              : task.priority === "02"
              ? "Medium"
              : "Low",
          taskType: task.task_type_display || task.task_type || "General",
          customer: task.customer?.name || "No Customer",
          assignedTo:
            task.curr_user?.user_nick_name ||
            task.curr_user?.user_name ||
            "Unassigned",
          owner:
            task.owner?.user_nick_name || task.owner?.user_name || "No Owner",
          originalData: task,
        }))
        .filter(
          (task) => statusFilter === "ALL" || task.status === statusFilter
        );

      setTasks(formattedTasks);
      console.log("Filtered Tasks:", formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskComplete = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const confirmCompletion = async () => {
    setModalVisible(false);
    setIsUpdating(true);

    try {
      if (!selectedTask?.originalData?.id) {
        throw new Error("Missing task ID");
      }

      const taskData = {
        curr_user: selectedTask?.originalData?.curr_user?.id || "",
        id: selectedTask.originalData.id,
        name:
          selectedTask.originalData.name ||
          selectedTask.title ||
          "Unnamed Task",
        remarks:
          selectedTask.originalData.remarks || selectedTask.description || "",
        start_time: selectedTask.originalData.start_time || null,
        task_date:
          selectedTask.originalData.task_date ||
          selectedTask.taskDate ||
          new Date().toLocaleDateString("en-GB"),
        task_type:
          selectedTask.originalData.task_type ||
          selectedTask.taskType ||
          "GENERAL",
      };

      await updateTask(taskData, "Y", "N");
      fetchTasks(selectedDayFilter, selectedStatusFilter);
    } catch (error) {
      console.error("Error completing task:", error);
      Alert.alert("Error", error.message || "Failed to complete task");
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelCompletion = () => {
    setModalVisible(false);
  };

  const renderFilterPill = (label, selected, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterPill,
        selected && styles.filterPillSelected,
      ]}
    >
      <Text style={[
        styles.filterPillText,
        selected && styles.filterPillTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A6FA5" />
      
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#4A6FA5', '#6B8CBE']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: company.image || "https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png",
              }}
              style={styles.profileImage}
            />
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.companyName}>
                {company.name || "Atomwalk Technologies"}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Task Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{tasks.length}</Text>
            <Text style={styles.summaryLabel}>Total Tasks</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {tasks.filter(t => t.status === "Completed").length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {tasks.filter(t => t.status === "Planned").length}
            </Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Date Filter</Text>
          <View style={styles.filterRow}>
            {dayFilterOptions.map(option => (
              renderFilterPill(
                option,
                selectedDayFilter === option,
                () => setSelectedDayFilter(option)
              )
            ))}
          </View>
          
          <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Status Filter</Text>
          <View style={styles.filterRow}>
            {statusFilterOptions.map(option => (
              renderFilterPill(
                option,
                selectedStatusFilter === option,
                () => setSelectedStatusFilter(option)
              )
            ))}
          </View>
        </View>

        {/* Task List */}
        <View style={styles.taskListHeader}>
          <Text style={styles.taskListTitle}>My Tasks</Text>
          <Text style={styles.taskCount}>{tasks.length} tasks</Text>
        </View>

        <GestureHandlerRootView style={styles.taskListContainer}>
          {tasks.length > 0 ? (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NewTaskCard task={item} onMarkComplete={handleTaskComplete} />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noTaskContainer}>
              <Ionicons name="checkmark-done-circle" size={60} color="#D3D3D3" />
              <Text style={styles.noTaskText}>No Tasks Available</Text>
              <Text style={styles.noTaskSubText}>You're all caught up!</Text>
            </View>
          )}
        </GestureHandlerRootView>
      </View>

      <ModalComponent
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        confirmCompletion={confirmCompletion}
        cancelCompletion={cancelCompletion}
        isUpdating={isUpdating}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userTextContainer: {
    marginLeft: width * 0.04,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  companyName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: width * 0.28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A6FA5',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: -8,
  },
  filterPill: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    marginBottom: 8,
  },
  filterPillSelected: {
    backgroundColor: '#4A6FA5',
  },
  filterPillText: {
    fontSize: 14,
    color: '#6C757D',
  },
  filterPillTextSelected: {
    color: '#FFFFFF',
  },
  taskListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskListTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#343A40',
  },
  taskCount: {
    fontSize: 14,
    color: '#6C757D',
  },
  taskListContainer: {
    // flex: 1,
  },
  listContent: {
    paddingBottom: height * 0.1,
  },
  noTaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.2,
  },
  noTaskText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C757D',
    marginTop: 15,
  },
  noTaskSubText: {
    fontSize: 14,
    color: '#ADB5BD',
    marginTop: 5,
  },
});

export default HomeScreen;