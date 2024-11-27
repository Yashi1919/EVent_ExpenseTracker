import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import tw from "twrnc";

const AboutAppModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[tw`bg-white p-6 rounded-lg`, { width: "90%" }]}>
          <Text style={tw`text-lg font-bold text-center mb-4`}>About Event Expense Tracker</Text>
          <Text style={tw`text-gray-600 mb-4 text-center`}>
            The Event Expense Tracker app is designed to help you effortlessly manage the finances of your events. Whether it's a personal celebration, corporate event, or fundraising campaign, this app allows you to:
          </Text>
          <Text style={tw`text-gray-600 mb-4`}>
            - Track event expenses in real-time.{'\n'}
            - Add multiple expense categories.{'\n'}
            - Maintain a record of fundraisers and contributions.{'\n'}
            - View detailed statistics of expenses and funds.{'\n'}
            - Organize and manage multiple events with ease.
          </Text>
          <Text style={tw`text-gray-600 mb-4 text-center`}>
            With a clean and intuitive interface, Event Expense Tracker ensures that you stay on top of your event finances, leaving you free to focus on making your events successful!
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-600 py-2 rounded-lg`}
            onPress={onClose}
          >
            <Text style={tw`text-center text-white font-bold`}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AboutAppModal;
