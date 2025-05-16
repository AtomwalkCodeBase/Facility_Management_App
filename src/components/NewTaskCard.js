import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewTaskCard = ({ task, onMarkComplete }) => {
  // Define priority-based left border colors
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High':
        return '#e53935'; // Red
      case 'Medium':
        return '#fb8c00'; // Orange
      case 'Low':
        return '#43a047'; // Green
      default:
        return '#1a73e8'; // Blue
    }
  };

  // Define status-based styling
  const getStatusStyle = () => {
    switch (task.status) {
      case 'Completed':
        return {
          bg: '#e8f5e9',
          color: '#43a047',
          icon: 'checkmark-circle'
        };
      case 'In Progress':
        return {
          bg: '#e3f2fd',
          color: '#1976d2',
          icon: 'time'
        };
      case 'Not planned':
        return {
          bg: '#ede7f6',
          color: '#5e35b1',
          icon: 'calendar'
        };
      default:
        return {
          bg: '#e0f7fa',
          color: '#00acc1',
          icon: 'hourglass'
        };
    }
  };

  const statusStyle = getStatusStyle();

  const handlePress = () => {
    onMarkComplete(task); // Pass the task to HomePage to trigger the modal
  };

  return (
    <Animated.View style={[styles.card, { borderLeftColor: getPriorityColor() }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Ionicons name={statusStyle.icon} size={12} color={statusStyle.color} style={styles.statusIcon} />
          <Text style={[styles.statusText, { color: statusStyle.color }]}>{task.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardDetails}>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
        ) : null}
        
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{task.taskDate}</Text>
            </View>
            
            {task.time ? (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{task.time}</Text>
              </View>
            ) : null}
          </View>

          {task.customer && task.customer !== 'No Customer' ? (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="business-outline" size={14} color="#666" />
                <Text style={styles.metaText} numberOfLines={1}>{task.customer}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      {task.status !== 'Completed' && (
        <TouchableOpacity 
          style={styles.completeButton} 
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  cardDetails: {
    padding: 16,
    paddingTop: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    color: '#666',
    marginLeft: 4,
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default NewTaskCard;