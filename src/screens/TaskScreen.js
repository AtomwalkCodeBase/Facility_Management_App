import { View, Text, Dimensions, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from 'react';
import { getUserTasks } from '../services/productServices';
import SwipeableTaskCard from '../components/SwipeableTaskCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get("window");

const dayFilterOptions = [
	{ label: "ALL", value: "ALL" },
  { label: "TODAY", value: "D0" },
  { label: "NEXT 3", value: "D3" },
  { label: "PAST", value: "PAST" },
];

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const fetchTasks = async (taskType) => {
    try {
      const res = await getUserTasks(taskType, "", "");
      console.log("Fetched Tasks:", res.data);

      const formattedTasks = res.data.map((task) => ({
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
        assignedTo: task.curr_user?.user_nick_name || task.curr_user?.user_name || "Unassigned",
        owner: task.owner?.user_nick_name || task.owner?.user_name || "No Owner",
        originalData: task, // Keep original data for reference
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(selectedFilter);
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Day Filter Buttons */}
      <View style={styles.filterContainer}>
        {dayFilterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedFilter === filter.value && styles.activeFilter
            ]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.value && styles.activeFilterText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
	   <GestureHandlerRootView style={styles.taskListContainer}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SwipeableTaskCard task={item} />}
        contentContainerStyle={styles.listContent}
      />
	  </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: height * 0.015,
    backgroundColor: "#fff",
    elevation: 5,
    marginBottom: height * 0.02,
  },
  filterButton: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  filterText: {
    fontSize: width * 0.04,
    fontWeight: "500",
    color: "#333",
  },
  activeFilter: {
    backgroundColor: "#6A1B9A",
  },
  activeFilterText: {
    color: "#FFF",
  },
  listContent: {
    paddingBottom: height * 0.1,
  },
  taskListContainer: {
    flex: 1, // Allows task list to be scrollable
    // marginTop: height * 0.03,
    marginHorizontal: width * 0.04,
  },
});

export default TaskScreen;
