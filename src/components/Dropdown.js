import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

const { width, height } = Dimensions.get("window");

const Dropdown = ({ label, placeholder, options = [], selectedValue, onSelect, style, icon }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    // Filter out "Cancel" from the options to prevent duplicate
    if (item !== "Cancel") {
      onSelect(item);
    }
    setModalVisible(false);
  };

  // Remove "Cancel" from the rendering options
  const filteredOptions = options.filter(option => option !== "Cancel");

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.buttonContent}>
          <Ionicons name={icon} size={18} color="#6A1B9A" style={styles.icon} />
          <Text style={styles.filterText}>{selectedValue || label}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedValue === item && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: height * 0.02,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6A1B9A",
    borderRadius: 20,
    padding: width * 0.03,
    backgroundColor: "#F9FAFB",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: width * 0.02,
  },
  icon: {
    marginRight: width * 0.02,
  },
  filterText: {
    color: "#6A1B9A",
    fontSize: width * 0.035,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: height * 0.02,
    maxHeight: "70%",
  },
  optionItem: {
    borderRadius: 10,
    padding: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.005,
  },
  optionText: {
    fontSize: width * 0.04,
    color: "#6A1B9A",
  },
  selectedOption: {
    backgroundColor: "rgba(106, 27, 154, 0.2)", // Light purple highlight
    borderWidth: 1,
    borderColor: "#6A1B9A",
  },
  selectedOptionText: {
    fontWeight: "bold",
    color: "#6A1B9A", // Deep purple for selected text
  },
  cancelButton: {
    padding: height * 0.02,
    alignItems: "center",
    backgroundColor: "#6A1B9A", // Changed to match purple theme
    marginTop: height * 0.01,
    marginHorizontal: width * 0.04,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: width * 0.04,
    color: "white",
    fontWeight: "600",
  },
});

export default Dropdown;