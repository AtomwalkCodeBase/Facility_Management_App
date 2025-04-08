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

const { width, height } = Dimensions.get("window");

const dayFilterOptions = ["TODAY", "NEXT 3", "PAST", "ALL"];
const statusFilterOptions = ["Planned", "Completed", "Not planned"];

const HomePage = ({ navigation }) => {
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
  const [selectedDayFilter, setSelectedDayFilter] = useState("TODAY");
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
    if (dayFilter === "TODAY") taskType = "D0";
    else if (dayFilter === "NEXT 3") taskType = "D3";
    else if (dayFilter === "PAST") taskType = "PAST";
    else if (dayFilter === "CANCEL") taskType = "CANCEL";

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />
      <View style={styles.fixedHeader}>
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Image
              source={{
                uri:
                  company.image ||
                  "https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png",
              }}
              style={styles.profileImage}
            />
          </View>
          <View>
            {/* <Text style={styles.userGreeting}>Hello</Text> */}
            <Text style={styles.userMessage}>
             {company.name || "Atomwalk Technologies"}
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Dropdown
            label="Filter by Day"
            placeholder="Select Day"
            options={dayFilterOptions}
            selectedValue={selectedDayFilter}
            onSelect={setSelectedDayFilter}
            icon="calendar"
            style={styles.dropdownStyle}
          />
          <Dropdown
            label="Filter by Status"
            placeholder="Select Status"
            options={statusFilterOptions}
            selectedValue={selectedStatusFilter}
            onSelect={setSelectedStatusFilter}
            icon="filter"
            style={styles.dropdownStyle}
          />
        </View>
      </View>

      <GestureHandlerRootView style={styles.taskListContainer}>
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NewTaskCard task={item} onMarkComplete={handleTaskComplete} />
            )}
            ListHeaderComponent={() => (
              <Text style={styles.taskHeading}>My Tasks</Text>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noTaskContainer}>
            <Text style={styles.noTaskText}>No Tasks Available</Text>
          </View>
        )}
        <ModalComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          confirmCompletion={confirmCompletion}
          cancelCompletion={cancelCompletion}
          isUpdating={isUpdating}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  fixedHeader: {
    backgroundColor: "#6A1B9A",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: "#E8E5DE",
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
    marginTop: height * 0.02,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.06,
  },
  userGreeting: {
    fontSize: width * 0.045,
    color: "#FAFAFA",
  },
  userMessage: {
    width: width * 0.7,
    fontSize: width * 0.06,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.03,
  },
  dropdownStyle: {
    flex: 1,
    marginHorizontal: width * 0.02,
  },
  taskListContainer: {
    flex: 1,
    marginTop: height * 0.03,
    marginHorizontal: width * 0.04,
  },
  taskHeading: {
    fontSize: width * 0.055,
    fontWeight: "500",
    marginBottom: height * 0.01,
  },
  listContent: {
    paddingBottom: height * 0.1,
  },
  noTaskContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTaskText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#888",
  },
});

export default HomePage;
