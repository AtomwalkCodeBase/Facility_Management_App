import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwipeableTaskCard from "../components/SwipeableTaskCard";
import { getUserTasks } from "../services/productServices";
import Dropdown from "../components/Dropdown";

const { width, height } = Dimensions.get("window");

const dayFilterOptions = ["TODAY", "NEXT 3", "PAST", "ALL"];
const statusFilterOptions = ["Planned", "Completed", "Not planned"];

const NewHomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedDayFilter, setSelectedDayFilter] = useState("TODAY");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Planned");

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

    // const fetchUserPin = async () => {
    //   const storedPin = await AsyncStorage.getItem('userPin');
    //   setUserPin(storedPin);
    // };

    fetchProfile();
    // fetchUserPin();
  }, []);

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
          originalData: task, // Keep original data for reference
        }))
        .filter(
          (task) => statusFilter === "ALL" || task.status === statusFilter
        );

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(selectedDayFilter, selectedStatusFilter);
  }, [selectedDayFilter, selectedStatusFilter]);

  const markTaskAsComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Complete" } : task
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header & Filter Section */}
      <View style={styles.fixedHeader}>
        {/* User Greeting */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            {/* <FontAwesome5 name="user-alt" size={20} color="black" /> */}
                        <Image source={{ uri: profile?.image }} style={styles.profileImage} />
          </View>
          <View>
            <Text style={styles.userGreeting}>Hi,User</Text>
            <Text style={styles.userMessage}>Good Morning!</Text>
          </View>
        </View>

        {/* Fixed Dropdown Filters */}
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

      {/* Scrollable Task List or No Task Message */}
      <GestureHandlerRootView style={styles.taskListContainer}>
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SwipeableTaskCard task={item} onMarkComplete={markTaskAsComplete} />
            )}
            ListHeaderComponent={() => (
              <Text style={styles.taskHeading}>My Tasks</Text>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noTaskContainer}>
            <Text style={styles.noTaskText}>No Tasks Available</Text>
          </View>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default NewHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
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
  },
  userGreeting: {
    fontSize: width * 0.045,
    color: "#FAFAFA",
  },
  userMessage: {
    fontSize: width * 0.06,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.030,
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
