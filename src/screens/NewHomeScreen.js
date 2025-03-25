import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
  import NewCard from "../components/NewCard";
  import SwipeableTaskCard from "../components/SwipeableTaskCard";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getUserTasks } from "../services/productServices";
  
  const NewHomeScreen = () => {
	// const [tasks, setTasks] = useState([
	//   {
	// 	id: '1',
	// 	category: 'Development',
	// 	title: 'Create a Landing Page',
	// 	startDate: '22 Mar 2025',
	// 	endDate: '22 Mar 2025',
	// 	status: 'Complete'
	//   },
	//   {
	// 	id: '2',
	// 	category: 'Development',
	// 	title: 'Create a Landing Page',
	// 	startDate: '22 Mar 2025',
	// 	endDate: '22 Mar 2025',
	// 	status: 'Todo'
	//   },
	//   {
	// 	id: '3',
	// 	category: 'Development',
	// 	title: 'Create a Landing Page',
	// 	startDate: '22 Mar 2025',
	// 	endDate: '22 Mar 2025',
	// 	status: 'Pending'
	//   },
	//   {
	// 	id: '4',
	// 	category: 'Development',
	// 	title: 'Create a Landing Page',
	// 	startDate: '22 Mar 2025',
	// 	endDate: '22 Mar 2025',
	// 	status: 'Complete'
	//   },
	// ]);

	const [tasks, setTasks] = useState([]);

	const fetchTasks = async (index) => {
	  let taskType = "ALL"; // Default case
	  if (index === 0) taskType = "D0"; // Today
	  else if (index === 1) taskType = "D3"; // Next 3 Days
	  else if (index === 2) taskType = "PAST"; // Past Tasks
	  else if (index === 3) taskType = "ALL"; // All Tasks
  
	  try {
		const res = await getUserTasks(taskType, "", "");
		console.log("Fetched Tasks: ", res.data);
		
		// Extracting required fields
		const formattedTasks = res.data.map(task => ({
			category: "Default Value",
		  id: task.id.toString(), // Ensure ID is a string
		  title: task.name || "No Title",
		  startDate: task.task_date || "N/A",
		  endDate: task.task_date || "N/A", // Assuming it's a single-day task
		  status: task.task_status || "Pending", // Default to "Pending"
		}));
	
		setTasks(formattedTasks);
	  } catch (error) {
		console.error("Error fetching tasks:", error);
	  }
	};
  
	useEffect(() => {
	  fetchTasks(0); // Call fetchTasks with default index (Today)
	}, []);
  
	// Function to mark a task as complete
	const markTaskAsComplete = (taskId) => {
	  setTasks(
		tasks.map(task => 
		  task.id === taskId 
			? { ...task, status: 'Complete' } 
			: task
		)
	  );
	};
  
	// Create a header component for the FlatList that contains all the static content
	const ListHeaderComponent = () => (
	  <>
		{/* Task Container */}
		<View style={styles.TaskContainer}>
		  <Text style={styles.TaskHeading}>Overall View</Text>
		  <View style={styles.TaskCardsContainer}>
			<NewCard 
			  title="Today" 
			  count={10} 
			  backgroundColor="#1e4bb9" 
			/>
			<NewCard 
			  title="Pending" 
			  count={60} 
			  backgroundColor="#e74c55" 
			/>
			<NewCard 
			  title="Complete" 
			  count={10} 
			  backgroundColor="#17c27b" 
			/>
		  </View>
		</View>
  
		<View style={styles.TaskContainer}>
		  <Text style={styles.TaskHeading}>My Task</Text>
		  <Text style={styles.instruction}>
			Swipe a task left to mark it as complete
		  </Text>
		</View>
	  </>
	);
  
	return (
	  <SafeAreaView style={styles.safeArea}>
		<View style={styles.Container}>
		  {/* User Info Section */}
		  <View style={styles.UserSection}>
			<View style={styles.UserSectionLeft}>
			  <View style={styles.User}>
				<FontAwesome5 name="user-alt" size={20} color="black" />
			  </View>
			  <View>
				<Text style={styles.userGreeting}>Hi, Souvagya</Text>
				<Text style={styles.userMessage}>Good Morning!</Text>
			  </View>
			</View>
			{/* <TouchableOpacity style={styles.UserSectionRight}>
			  <MaterialIcons name="notifications-none" size={24} color="white" />
			</TouchableOpacity> */}
		  </View>
  
		  {/* Search Bar */}
		  <View style={styles.searchContainer}>
			<View style={styles.searchBar}>
			  <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
			  <TextInput
				style={styles.searchInput}
				placeholder="Search products..."
				placeholderTextColor="#FFFFFF"
			  />
			</View>
			{/* Filter Icon */}
			<TouchableOpacity style={styles.filterIcon}>
			  <Ionicons name="funnel-outline" size={22} color="#777" />
			</TouchableOpacity>
		  </View>
		</View>
  
		<GestureHandlerRootView style={styles.listContainer}>
		  <FlatList
			data={tasks}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
			  <SwipeableTaskCard
				task={item}
				onMarkComplete={markTaskAsComplete}
			  />
			)}
			ListHeaderComponent={ListHeaderComponent}
			contentContainerStyle={styles.listContent}
		  />
		</GestureHandlerRootView>
	  </SafeAreaView>
	);
  };
  
  export default NewHomeScreen;
  
  const styles = StyleSheet.create({
	safeArea: {
	  flex: 1,
	  backgroundColor: '#f8f8f8',
	},
	Container: {
	  backgroundColor: "#6A1B9A",
	  padding: 20,
	  borderBottomLeftRadius: 30,
	  borderBottomRightRadius: 30,
	  elevation: 5,
	},
	UserSection: {
	  flexDirection: "row",
	  justifyContent: "space-between",
	  alignItems: "center",
	},
	User: {
	  width: 50,
	  height: 50,
	  backgroundColor: "#E8E5DE",
	  borderRadius: 50,
	  justifyContent: "center",
	  alignItems: "center",
	},
	UserSectionLeft: {
	  flexDirection: "row",
	  alignItems: "center",
	  gap: 10,
	},
	UserSectionRight: {
	  justifyContent: "center",
	  alignItems: "center",
	},
	userGreeting: {
	  fontSize: 17,
	  color: "#FAFAFA",
	},
	userMessage: {
	  fontSize: 23,
	  color: "#FFFFFF",
	  fontWeight: "600",
	},
  
	// Search Bar
	searchContainer: {
	  flexDirection: "row",
	  alignItems: "center",
	  marginTop: 40,
	  marginBottom: 20,
	  gap: 10,
	},
	searchBar: {
	  flexDirection: "row",
	  alignItems: "center",
	  paddingHorizontal: 12,
	  borderColor: "#9B9B9A",
	  borderWidth: 1,
	  backgroundColor: "#6A1B9A",
	  borderRadius: 24,
	  height: 50,
	  flex: 1, // Makes searchBar take up available space
	},
	searchIcon: {
	  marginRight: 8,
	},
	searchInput: {
	  flex: 1,
	  height: "100%", // Ensures full height usage
	  fontSize: 16,
	  paddingVertical: 10,
	  color: "#FFFFFF",
	  textAlignVertical: "center",
	},
	filterIcon: {
	  backgroundColor: "#FFFFFF",
	  borderRadius: 24,
	  padding: 10,
	},
  
	// Task Container
	TaskContainer: {
	//   padding: 14,
	marginVertical:20
	},
	TaskHeading: {
	  fontSize: 22,
	  fontWeight: "500",
	  marginBottom: 8,
	},
	TaskCardsContainer: {
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	  columnGap: 7,
	},
  
	// My Task
	listContainer: {
	  flex: 1,
	},
	instruction: {
	  fontSize: 14,
	  color: '#666',
	//   marginBottom: 2,
	  fontStyle: 'italic',
	},
	listContent: {
	  paddingHorizontal: 16,
	  paddingBottom: 20,
	},
  });