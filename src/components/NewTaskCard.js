import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';
import { router } from 'expo-router';
import ImageModal from './ImageModal';

const NewTaskCard = ({ task, onMarkComplete }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLongDescription, setIsLongDescription] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState(null);


  // Memoized priority configuration
  const priorityConfig = useMemo(() => {
    const priorityMap = {
      "01": "High",
      "02": "Medium", 
      "03": "Low"
    };
    
    const priorityName = priorityMap[task.priority] || task.priority || "Medium";
    
    const colors = {
      "High": { 
        cardBg: "#FEF7F7", 
        accentBg: "#FFF5F5", 
        border: "#FECACA", 
        text: "#B91C1C", 
        dot: "#DC2626",
        shadow: "#FCA5A5"
      },
      "Medium": { 
        cardBg: "#FFFBF7", 
        accentBg: "#FFF7ED", 
        border: "#FED7AA", 
        text: "#C2410C", 
        dot: "#EA580C",
        shadow: "#FDBA74"
      },
      "Low": { 
        cardBg: "#F6FDF9", 
        accentBg: "#F0FDF4", 
        border: "#BBF7D0", 
        text: "#166534", 
        dot: "#16A34A",
        shadow: "#86EFAC"
      }
    };
    
    return {
      name: priorityName,
      ...colors[priorityName]
    };
  }, [task.priority]);

  // Memoized status configuration
  const statusConfig = useMemo(() => {
    const statusColors = {
      'Completed': { bg: '#10B981', icon: 'checkmark-circle' },
      'Planned': { bg: '#3B82F6', icon: 'calendar-outline' },
      'In Progress': { bg: '#8B5CF6', icon: 'play-circle' },
      'On Hold': { bg: '#F59E0B', icon: 'pause-circle' },
      'Waiting for Response': { bg: '#EF4444', icon: 'time-outline' },
      'Reassigned to User': { bg: '#F97316', icon: 'person-circle' },
      'Closed- Not Successful': { bg: '#EF4444', icon: 'close-circle' },
      'Deleted': { bg: '#6B7280', icon: 'trash-outline' },
      'Not Planned': { bg: '#6B7280', icon: 'ban-outline' }
    };
    
    return statusColors[task.status] || { bg: '#6B7280', icon: 'help-circle-outline' };
  }, [task.status]);

  // Determine if task can be marked complete
  const canMarkComplete = useMemo(() => {
    const hiddenStatuses = ['In Progress', 'Completed', 'On Hold', 'Reassigned to User', 
                           'Closed- Not Successful', 'Waiting for Response', 'Deleted', 'Not Planned'];
    return !hiddenStatuses.includes(task.status);
  }, [task.status]);

  const handlePress = () => onMarkComplete(task);
  const handleImagePress = (data) => {
    setImage(data?.originalData?.ref_file)
    setIsModalVisible(true);
  }
  const handleCloseModal = () => setIsModalVisible(false);

  const handleDescriptionTextLayout = (e) => {
    if (e.nativeEvent.lines.length > 2 && !isLongDescription) {
      setIsLongDescription(true);
    }
  };

  const formatTaskType = (type) => {
    return type?.replace(/([A-Z])/g, ' $1').trim() || 'General Task';
  };

  const formatTime = () => {
    const start = task.originalData?.start_time;
    const end = task.originalData?.end_time;
    if (!start && !end) return null;
    return `${start || ''} ${end ? `- ${end}` : ''}`.trim();
  };

  return (
    <Animated.View style={[
      styles.card, 
      { 
        backgroundColor: priorityConfig.cardBg,
        borderColor: priorityConfig.border,
        shadowColor: priorityConfig.shadow,
      }
    ]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.priorityIndicator}>
            <View style={[styles.priorityDot, { backgroundColor: priorityConfig.dot }]} />
            <Text style={[styles.priorityText, { color: priorityConfig.text }]}>
              {priorityConfig.name}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Ionicons name={statusConfig.icon} size={12} color="white" />
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {task.title.split('[')[0]}
        </Text>

        <View style={styles.taskTypeContainer}>
          <MaterialCommunityIcons name="tag-outline" size={14} color="#6B7280" />
          <Text style={styles.taskType}>
            {task.originalData?.task_category_name || formatTaskType(task.taskType)}
          </Text>
        </View>
      </View>

      {/* Description Section */}
      {task.description && (
        <View style={[styles.descriptionContainer, { backgroundColor: priorityConfig.accentBg }]}>
          <Text
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 2}
            ellipsizeMode="tail"
            onTextLayout={handleDescriptionTextLayout}
          >
            {task.description}
          </Text>
          {isLongDescription && (
            <TouchableOpacity 
              onPress={() => setShowFullDescription(!showFullDescription)}
              style={styles.readMoreButton}
            >
              <Text style={[styles.readMoreText, { color: priorityConfig.text }]}>
                {showFullDescription ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Date & Time Row */}
        {task.taskDate && (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{task.taskDate}</Text>
            </View>
            {formatTime() && (
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{formatTime()}</Text>
              </View>
            )}
          </View>
        )}

        {/* Customer Row */}
        {task.customer && task.customer !== 'No Customer' && (
          <View style={styles.detailRow}>
            <View style={[styles.detailItem, styles.fullWidth]}>
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText} numberOfLines={1}>{task.customer}</Text>
            </View>
          </View>
        )}

        {/* Assigned To Row
        {task.assignedTo && (
          <View style={styles.detailRow}>
            <View style={[styles.detailItem, styles.fullWidth]}>
              <MaterialCommunityIcons name="account-supervisor" size={16} color="#6B7280" />
              <Text style={styles.detailText} numberOfLines={1}>{task.assignedTo}</Text>
            </View>
          </View>
        )} */}
      </View>

      {/* Image Attachment */}
      {task?.originalData?.ref_file && (
        <TouchableOpacity style={styles.imageAttachment} onPress={() =>handleImagePress(task)}>
          <View style={styles.imageAttachmentContent}>
            <FontAwesome name="image" size={16} color="#6B7280" />
            <Text style={styles.imageAttachmentText}>Problem Image</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}

      {/* Action Button */}
      {canMarkComplete && (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <AntDesign name="checkcircleo" size={18} color="white" />
          <Text style={styles.actionButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}

      <ImageModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        qrValue={image}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white', // Will be overridden by priority color
    marginVertical: 6,
    // marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000', // Will be overridden by priority shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#F3F4F6', // Will be overridden by priority border
  },
  
  header: {
    marginBottom: 16,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 8,
  },
  
  taskTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  taskType: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  descriptionContainer: {
    backgroundColor: '#F9FAFB', // Will be overridden by priority accent color
    padding: 8,
    borderRadius: 12,
    marginBottom: 5,
    borderLeft: 4,
    borderLeftColor: '#E5E7EB',
  },
  
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  
  readMoreButton: {
    marginTop: 8,
  },
  
  readMoreText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  
  detailsGrid: {
    marginBottom: 16,
  },
  
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  
  fullWidth: {
    flex: 1,
  },
  
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  
  imageAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  
  imageAttachmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  imageAttachmentText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});

export default NewTaskCard;