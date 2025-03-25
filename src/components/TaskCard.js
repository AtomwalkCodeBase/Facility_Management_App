import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskCard = ({ 
  category, 
  title, 
  taskDate, 
  time,
  customer,
  status
}) => {
  // Function to render the status tag
  const renderStatusTag = () => {
    if (!status) return null;
    
    let bgColor = '#ffffff';
    let textColor = '#000000';
    
    switch (status.toLowerCase()) {
      case 'complete':
        bgColor = '#e8f9f0';
        textColor = '#17c27b';
        break;
      case 'pending':
        bgColor = '#fff8e8';
        textColor = '#ffb840';
        break;
      case 'todo':
        bgColor = '#ffe8e8';
        textColor = '#ff5a5a';
        break;
      case 'planned':
        bgColor = '#ffe8e8';
        textColor = '#ff5a5a';
        break;
      default:
        break;
    }
    
    return (
      <View style={[styles.statusTag, { backgroundColor: bgColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        {/* <Text style={styles.category}>{category}</Text> */}
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Ionicons name="calendar" size={16} color="#9c27b0" />
            <Text style={styles.dateText}>{taskDate}</Text>
          </View>
          
          <View style={styles.dateItem}>
            <Ionicons name="time" size={16} color="#9c27b0" />
            <Text style={styles.dateText}>{time}</Text>
          </View>
        </View>
        <View style={styles.dateItem}>
            <Ionicons name="location" size={16} color="#9c27b0" />
            <Text style={styles.dateText}>{customer}</Text>
          </View>
        
      </View>
        {renderStatusTag()}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  category: {
    color: '#9c27b0',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 8,
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
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default TaskCard;