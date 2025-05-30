import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';

const NewTaskCard = ({ task, onMarkComplete }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLongDescription, setIsLongDescription] = useState(false);
  // Define priority-based colors
  // const getPriorityColor = () => {
  //   switch (task.priority) {
  //     case 'High':
  //       return bg: '#D9E6F6', // Red
  //     case 'Medium':
  //       return '#FF9500'; // Orange
  //     case 'Low':
  //       return '#45B7D1'; // Green
  //     default:
  //       return '#1a73e8'; // Blue
  //   }
  // };

   const getPriorityColor = () => {
     switch (task.priority) {
       case "High":
         return { bg: "#D9E6F6", color: "#3B4A75" }; // Red
       case "Medium":
         return {
           bg: "#DFF6E4",
           color: "#2F5D3B",
         }; // Orange
       case "Low":
         return {
           bg: "#FDE8DC",
           color: "#7A4E35",
         }; // Green
       default:
         return { bg: "#E9E4F0", color: "#4A4370" }; // Blue
     }
   };

  // Define status-based styling
  // const getStatusStyle = () => {
  //   switch (task.status) {
  //     case 'Completed':
  //       return {
  //         // bg: '#e8f5e9',
  //         bg: '#27AE60',
  //         // color: '#43a047',
  //         color: '#fff',
  //         icon: 'checkmark-circle'
  //       };
  //     case 'In Progress':
  //       return {
  //         bg: '#e3f2fd',
  //         color: '#1976d2',
  //         icon: 'time'
  //       };
  //     case 'Not planned':
  //       return {
  //         bg: '#ede7f6',
  //         color: '#5e35b1',
  //         icon: 'calendar'
  //       };
  //     default:
  //       return {
  //         // bg: '#e0f7fa',
  //         bg: '#F39C12',
  //         color: '#fff',
  //         // color: '#00acc1',
  //         icon: 'hourglass'
  //       };
  //   }
  // };

  const getStatusStyle = () => {
  switch (task.status) {
    // Success/Completion states
    case 'Completed':
      return {
        bg: '#27AE60', // Green
        color: '#fff',
        icon: 'checkmark-circle'
      };
    
    // Active/Working states
    case 'Planned':
      return {
        bg: '#3498DB', // Blue
        color: '#fff',
        icon: 'calendar-outline'
      };
    case 'In Progress':
      return {
        bg: '#9B59B6', // Purple
        color: '#fff',
        icon: 'play-circle'
      };
    
    // Paused/Waiting states
    case 'On Hold':
      return {
        bg: '#E67E22', // Orange
        color: '#fff',
        icon: 'pause-circle'
      };
    case 'Waiting for Response':
      return {
        bg: '#F1C40F', // Yellow
        color: '#fff',
        icon: 'time-outline'
      };
    case 'Reassigned to User':
      return {
        bg: '#FF8C00', // Dark Orange
        color: '#fff',
        icon: 'person-circle'
      };
    
    // Negative/Closed states
    case 'Closed- Not Successful':
      return {
        bg: '#E74C3C', // Red
        color: '#fff',
        icon: 'close-circle'
      };
    case 'Deleted':
      return {
        bg: '#95A5A6', // Gray
        color: '#fff',
        icon: 'trash-outline'
      };
    case 'Not Planned':
      return {
        bg: '#7F8C8D', // Dark Gray
        color: '#fff',
        icon: 'ban-outline'
      };
    
    // Default fallback
    default:
      return {
        bg: '#BDC3C7', // Light Gray
        color: '#2C3E50', // Dark text for contrast
        icon: 'help-circle-outline'
      };
  }
};

  const hiddenStatuses = [
  // 'Planned',
  'In Progress',
  'Completed',
  'On Hold',
  'Reassigned to User',
  'Closed- Not Successful',
  'Waiting for Response',
  'Deleted',
  'Not Planned'
];

  const statusStyle = getStatusStyle();
  const priorityColor = getPriorityColor();

  const handlePress = () => {
    onMarkComplete(task); // Pass the task to Homepage to trigger the modal
  };

    const handleDescriptionTextLayout = (e) => {
    if (e.nativeEvent.lines.length > 2 && !isLongDescription) {
      setIsLongDescription(true);
    }
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: priorityColor.bg }]}>
      {/* Top Section - Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, {color: priorityColor.color}]} numberOfLines={3}>{task.title}</Text>
      

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Ionicons name={statusStyle.icon} size={14} color="rgba(255,255,255,0.9)" />
          <Text style={[styles.statusText, { color: statusStyle.color }]} ellipsizeMode="tail" numberOfLines={1}>
            {task.status}
          </Text>
        </View>
      </View>

      </View>

      {/* Description */}
{task.description ? (
        <View style={styles.descriptionSection}>
          <Text
            style={[styles.description, { color: priorityColor.color }]}
            numberOfLines={showFullDescription ? undefined : 2}
            ellipsizeMode="tail"
            onTextLayout={handleDescriptionTextLayout}
          >
            {task.description}
          </Text>
          {isLongDescription && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={{ color: priorityColor.color, marginTop: 4,   fontWeight: 'bold', }}>
                {showFullDescription ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {/* Task Details */}
      <View style={styles.detailsSection}>
        {/* Date */}
       {(task.taskDate || task.originalData?.start_time || task.originalData?.end_time) ? (
  <View style={styles.dateTimeRow}>
    {/* Date */}
    <View style={styles.inlineRow}>
      {/* <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.9)" /> */}
      <Ionicons name="calendar-outline" size={16} color={priorityColor.color}/>
      <Text style={[styles.inlineText, {color: priorityColor.color}]}>{task.taskDate}</Text>
    </View>

    {/* Time */}
    {(task.originalData?.start_time || task.originalData?.end_time) && (
      <View style={styles.inlineRow}>
        {/* <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.9)" /> */}
        <Ionicons name="time-outline" size={16} color={priorityColor.color} />
        <Text style={[styles.inlineText, {color: priorityColor.color}]}>
          {`${task.originalData?.start_time || ''}${task.originalData?.end_time ? ' - ' + task.originalData.end_time : ''}`}
        </Text>
      </View>
    )}
  </View>
) : null}

        {/* Customer */}
        {task.customer && task.customer !== 'No Customer' ? (
          <View style={styles.detailRow}>
             <Ionicons name="person-outline" size={16} color={priorityColor.color} />
            <Text style={[styles.detailValue, {color: priorityColor.color}]}>{task.customer}</Text>
          </View>
        ) : null}
      </View>

      {/* Complete Button */}
      {!hiddenStatuses.includes(task.status) && (
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <AntDesign name="checkcircleo" size={24} color="black" />
            <Text style={styles.buttonText}> MARK AS DONE</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};


export default NewTaskCard;
const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleSection: {
    // marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 26,
    maxWidth: 200
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    maxWidth: 70,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  descriptionSection: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 6,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    marginLeft: 8,
  },
  buttonSection: {
    marginTop: 8,
  },
  completeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    letterSpacing: 1,
  },
  dateTimeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
  backgroundColor: 'rgba(255,255,255,0.1)',
  padding: 10,
  borderRadius: 6,
},
inlineRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
inlineText: {
  fontSize: 16,
  color: '#ffffff',
  marginLeft: 8,
},
});