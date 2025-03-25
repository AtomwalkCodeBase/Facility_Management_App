import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from './TaskCard';

const SwipeableTaskCard = ({ task, onMarkComplete }) => {
  const translateX = useSharedValue(0);
  const borderRadius = 10;

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(event.translationX, -140); // Restrict swipe range
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        // Trigger mark complete action
        onMarkComplete?.(task.id);
        translateX.value = withSpring(-200); // Swipe out animation
      } else {
        translateX.value = withSpring(0); // Reset position
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        <View style={styles.rightAction}>
          <View style={styles.completeButton}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={24} color="#27B02F" />
            </View>
            <Text style={styles.completeText}>Mark Complete</Text>
          </View>
        </View>

        <Animated.View style={[styles.swipeableCard, animatedStyle]}>
          <TaskCard
            category={task.category}
            title={task.title}
            taskDate={task.taskDate}
            time={task.time}
            status={task.status}
            customer={task.customer}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  swipeableCard: {
    flex: 1,
    padding: 5,
    // borderRadius: 10,
    // overflow: 'hidden',
    backgroundColor: 'white',
    
    // elevation: 5, // Shadow for Android
  },
  rightAction: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 140,
    backgroundColor: '#E7FDE1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  completeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#27B02F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completeText: {
    color: '#27B02F',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SwipeableTaskCard;
