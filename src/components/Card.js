import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from "../Styles/appStyle";
import SliderButton from "./SliderButton"; // Import the SliderButton

const { width: screenWidth } = Dimensions.get("window");

const Card = ({
  data,
  navigation,
  screen,
  handleIconPress,
  icon,
  buttonTittle,
  colour,
  isAmtApplicable,
  handleDisplayPress,
  iconName1,
  handleIconName1Press,
  iconName2,
  iconScreen2,
  pilength,
  ProductInLength,
  onMarkAsCompleted,
}) => {
  const sub_title = data.customer ? data.customer.name : data.gstn_number ? `GSTN ${data.gstn_number}` : data.address_line_1;
  const cardColour = colour ? colour : colors.primary;

  const handleCardPress = () => {
    navigation.navigate('TaskDetails', { taskId: data.id });
  };

  const handleSlideComplete = () => {
    onMarkAsCompleted(data.id); // Trigger the callback when the slider is completed
  };

  return (
    <TouchableOpacity onPress={handleCardPress} style={styles.cardContainer}>
      <View style={styles.cardContainers}>
        <View style={styles.profileIconContainer}>
          <Image
            source={{ uri: data.customer ? data.customer.image : data.image }}
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.cardTitle}>{data.name}</Text>
        {sub_title && <Text style={styles.cardSubText}>{sub_title}</Text>}
        {data.task_date && <Text style={styles.cardSubText}>Planned on: {data.task_date}</Text>}
        {data.mobile_number && <Text style={styles.cardSubTexts}>Mobile No: {data.mobile_number}</Text>}
        {isAmtApplicable && data.outstanding_amt ? (
          <TouchableOpacity
            style={styles.actionButton2}
            onPress={() => handleDisplayPress({ data })}
          >
            <FontAwesome name="rupee" size={20} color="red" />
            <Text style={[styles.amountDue, { color: 'red' }]}>{data.outstanding_amt} - DUE AMT</Text>
          </TouchableOpacity>
        ) : isAmtApplicable && (
          <Text style={styles.noOutstanding}>NO OUTSTANDING</Text>
        )}

        {/* Use the SliderButton component */}
        <SliderButton onSlideComplete={handleSlideComplete} />
      </View>

      {screen === "CustomerTasks" && (
        <View style={styles.topIconsContainer}>
          <TouchableOpacity onPress={() => openWhatsApp(data.mobile_number)} style={styles.iconButton}>
            <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEmail(data.email_id)} style={styles.iconButton}>
            <MaterialIcons name="email" size={24} color="#D44638" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPhone(data.mobile_number)} style={styles.iconButton}>
            <FontAwesome5 name="phone" size={24} color="#34B7F1" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topIconsContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainers: {
    padding: 15,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '98%',
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 18,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: 280,
  },
  cardSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    maxWidth: 295,
  },
  cardSubTexts: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    maxWidth: 280,
    fontWeight: 'bold',
  },
  actionButton2: {
    flexDirection: 'row',
    padding: 2,
    marginTop: 10,
    marginRight: 50,
  },
  amountDue: {
    marginLeft: 5,
    fontSize: 14,
  },
  noOutstanding: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    color: 'green',
  },
});

export default Card;