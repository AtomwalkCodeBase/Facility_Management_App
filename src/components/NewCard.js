import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NewCard = ({ backgroundColor, title, count }) => {
  return (
	<View style={[styles.card, { backgroundColor }]}>
	<Text style={styles.cardTitle}>{title}</Text>
	<View style={styles.countContainer}>
	  <Text style={styles.countText}>{count}</Text>
	</View>
  </View>
);
};

export default NewCard;

const styles = StyleSheet.create({
	card: {
		// flexBasis: '33%',
		// flexWrap: "wrap",
		// borderRadius: 8,
		// paddingVertical: 8,
		// // paddingHorizontal: 8,
		// // width: '25%',
		// flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
		// columnGap:6
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexBasis: '33%',
		paddingVertical: 8,
		borderRadius: 8,
		columnGap:6

	  },
	  cardTitle: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	  },
	  countContainer: {
		backgroundColor: 'white',
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
	  },
	  countText: {
		fontWeight: 'bold',
	  },
	});