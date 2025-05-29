import { View, Text, Dimensions, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { getUserTasks, updateTask } from '../services/productServices';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NewTaskCard from '../components/NewTaskCard';
import ModalComponent from '../components/ModalComponent';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../components/Loader';

const { width, height } = Dimensions.get('window');

const dayFilterOptions = [
  { label: 'ALL', value: 'ALL' },
  { label: 'TODAY', value: 'D0' },
  { label: 'NEXT 3', value: 'D3' },
  { label: 'PAST', value: 'PAST' },
];

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTaskComplete = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const cancelCompletion = () => {
    setModalVisible(false);
  };

  const confirmCompletion = async () => {
    setModalVisible(false);
    setIsUpdating(true);

    try {
      if (!selectedTask?.originalData?.id) {
        throw new Error('Missing task ID');
      }

      const taskData = {
        curr_user: selectedTask?.originalData?.curr_user?.id || '',
        id: selectedTask.originalData.id,
        name: selectedTask.originalData.name || selectedTask.title || 'Unnamed Task',
        remarks: selectedTask.originalData.remarks || selectedTask.description || '',
        start_time: selectedTask.originalData.start_time || null,
        task_date: selectedTask.originalData.task_date || selectedTask.taskDate || new Date().toLocaleDateString('en-GB'),
        task_type: selectedTask.originalData.task_type || selectedTask.taskType || 'GENERAL',
      };

      await updateTask(taskData, 'Y', 'N');
      fetchTasks(selectedFilter);
    } catch (error) {
      console.error('Error completing task:', error);
      Alert.alert('Error', error.message || 'Failed to complete task');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchTasks = async (taskType) => {
    try {
      setIsLoading(true)
      const res = await getUserTasks(taskType, '', '');
      const formattedTasks = (res.data || []).map((task) => ({
        id: task.id.toString(),
        title: task.name || 'Untitled Task',
        description: task.remarks || '',
        taskDate: task.task_date || 'N/A',
        endDate: task.task_date || 'N/A',
        time: `${task.start_time} - ${task.end_time}` || '',
        startTime: task.start_time || '',
        endTime: task.end_time || '',
        status: task.task_status || 'Pending',
        priority:
          task.priority === '01'
            ? 'High'
            : task.priority === '02'
            ? 'Medium'
            : 'Low',
        taskType: task.task_type_display || task.task_type || 'General',
        customer: task.customer?.name || 'No Customer',
        assignedTo: task.curr_user?.user_nick_name || task.curr_user?.user_name || 'Unassigned',
        owner: task.owner?.user_nick_name || task.owner?.user_name || 'No Owner',
        originalData: task,
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Ensure tasks is set to empty array on error
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(selectedFilter);
  }, [selectedFilter]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Day Filter Buttons */}
        <View style={styles.filterContainer}>
          {dayFilterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                selectedFilter === filter.value && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.value && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task List or Empty State */}
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NewTaskCard task={item} onMarkComplete={handleTaskComplete} />
            )}
            contentContainerStyle={styles.taskListContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noTaskContainer}>
            <Ionicons name="checkmark-done-circle" size={60} color="#D3D3D3" />
            <Text style={styles.noTaskText}>No Tasks Available</Text>
            <Text style={styles.noTaskSubText}>You're all caught up!</Text>
          </View>
        )}

        <ModalComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          confirmCompletion={confirmCompletion}
          cancelCompletion={cancelCompletion}
          isUpdating={isUpdating}
        />
      </SafeAreaView>

      <Loader visible={isLoading}/>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: height * 0.015,
    backgroundColor: '#fff',
    elevation: 5,
    marginBottom: height * 0.02,
  },
  filterButton: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  filterText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
  },
  activeFilter: {
    backgroundColor: 'rgb(88, 139, 214)',
  },
  activeFilterText: {
    color: '#FFF',
  },
  taskListContainer: {
    flexGrow: 1,
    paddingBottom: height * 0.1,
    marginHorizontal: width * 0.04,
  },
  noTaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.3, // Ensure minimum height for visibility
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

export default TaskScreen;