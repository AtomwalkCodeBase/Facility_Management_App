import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import TaskCard from "./TaskCard";
import ModalComponent from "./ModalComponent";

const { width, height } = Dimensions.get("window");

const SwipeableTaskCard = ({ task, onMarkComplete }) => {
  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = -100; // Minimum swipe distance to trigger modal
  const [modalVisible, setModalVisible] = useState(false);

  const handleSwipeComplete = () => {
    setModalVisible(true); // Show confirmation modal
  };

  const confirmCompletion = () => {
    setModalVisible(false); // Close modal
    console.log("yes");
    
    if (onMarkComplete) {
        const payload = {
          id: task.id,
          mode: "Update",
          status: "Complete",
        };
        console.log("Payload sent:", payload);
      runOnJS(onMarkComplete)(task.id);
    }
    translateX.value = withSpring(0); // Reset swipe
  };

  const cancelCompletion = () => {
    setModalVisible(false); // Close modal
    console.log("no");
    translateX.value = withSpring(0); // Reset swipe if canceled
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX); // Only allow left swipe
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        runOnJS(handleSwipeComplete)();
      } else {
        translateX.value = withSpring(0); // Reset if not enough swipe
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Updated Modal component with better alignment
  // const ModalConfirmation = () => (
  //   <Modal visible={modalVisible} transparent animationType="fade">
  //     <View style={styles.modalOverlay}>
  //       <View style={styles.modalContent}>
  //         <Text style={styles.modalText}>
  //           Are you sure you want to complete this task?
  //         </Text>
  //         <TouchableOpacity  onPress={confirmCompletion} style={styles.modalButtons}>
  //           <TouchableOpacity
  //             style={[styles.button, styles.confirmButton]}
  //             onPress={confirmCompletion}
  //           >
  //             <Text style={styles.buttonText}>Confirm</Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             style={[styles.button, styles.cancelButton]}
  //             onPress={cancelCompletion}
  //           >
  //             <Text style={styles.buttonText}>Cancel</Text>
  //           </TouchableOpacity>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </Modal>
  // );

  return (
    <>
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.container}>
          {/* Background Swipe Action */}
          <View style={styles.rightAction}>
            <View style={styles.completeButton}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={24} color="#27B02F" />
              </View>
              <Text style={styles.completeText}>Complete</Text>
            </View>
          </View>

          {/* Task Card */}
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

      {/* Confirmation Modal */}
      {/* <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to complete this task?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={confirmCompletion}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelCompletion}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <ModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} confirmCompletion={confirmCompletion} cancelCompletion={cancelCompletion}/>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  swipeableCard: {
    flex: 1,
    padding: 5,
  },
  rightAction: {
    position: "absolute",
    right: 5,
    height: "80%",
    width: 140,
    backgroundColor: "#E7FDE1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  completeButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#27B02F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  completeText: {
    color: "#27B02F",
    fontWeight: "600",
    fontSize: 14,
  },
  // modalOverlay: {
  //   position: "absolute",
  //   height: height,
  //   // zIndex:10,
  //   flex: 1,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // modalContent: {
  //   zIndex:10,
  //   backgroundColor: "#fff",
  //   padding: 25,
  //   borderRadius: 10,
  //   width: "85%",
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOpacity: 0.2,
  //   shadowRadius: 10,
  //   elevation: 5,
  // },
  // modalText: {
  //   fontSize: 18,
  //   textAlign: "center",
  //   fontWeight: "600",
  //   marginBottom: 20,
  // },
  // modalButtons: {
  //   zIndex:100,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   // width: "100%",
  // },
  // button: {
  //   zIndex:300,
  //   flex: 1,
  //   paddingVertical: 12,
  //   marginHorizontal: 10,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },
  // confirmButton: {
  //   backgroundColor: "#27B02F",
  // },
  // cancelButton: {
  //   backgroundColor: "#D32F2F",
  // },
  // buttonText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
});

export default SwipeableTaskCard;
