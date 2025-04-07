import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewTaskCard = ({ task, onMarkComplete }) => {
  const renderStatusBadge = () => {
    let statusColor = '#FFC107';
    let textColor = '#FFC107';

    if (task.status === 'Completed') {
      statusColor = '#DBEAFE';
      textColor = '#3c9df1';
    } else if (task.status === 'In Progress') {
      statusColor = '#2196F3';
      textColor = '#3c9df1';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{task.status}</Text>
      </View>
    );
  };

  const handlePress = () => {
    onMarkComplete(task); // Pass the task to HomePage to trigger the modal
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color="#9c27b0" />
              <Text style={styles.dateText}>{task.taskDate}</Text>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color="#9c27b0" />
              <Text style={styles.dateText}>{task.time}</Text>
            </View>
          </View>
        </View>
        {renderStatusBadge()}
      </View>

      {task.status !== 'Completed' && (
        <TouchableOpacity style={styles.completeButton} onPress={handlePress}>
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 8,
    // marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dateText: {
    color: '#888',
    marginLeft: 4,
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 0,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NewTaskCard;