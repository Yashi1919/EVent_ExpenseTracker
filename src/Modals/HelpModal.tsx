import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import tw from "twrnc";

const HelpModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={[tw`bg-white p-6 rounded-lg`, { width: "90%" }]}>
          <Text style={tw`text-lg font-bold text-center mb-4`}>Help</Text>
          <ScrollView contentContainerStyle={tw`mb-4`}>
            <Text style={tw`text-gray-800 mb-2`}>
              Welcome to the Event Expense Tracker App! Here's how to use it:
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>
              1. **Creating an Event**: Navigate to the "Create Events" tab. Add the event name, date, and expense types. Once done, save the event.
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>
              2. **Adding Expenses**: Click on an event from the "Active Events" list. In the expenses tab, add expenses with their type, amount, and optional proof (image).
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>
              3. **Viewing Statistics**: Go to the "Statistics" tab to get a summary of expenses, fundraisers, and remaining balance for an event.
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>
              4. **Tracking History**: The "History" tab shows all transactions for an event, categorized by expenses and income.
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>
              5. **Fundraisers**: Add and track fundraisers for your event to manage income sources effectively.
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>
              6. **Profile Management**: Customize your profile by uploading a profile picture, setting your username, and tracking the total events you've created.
            </Text>

            <Text style={tw`text-gray-800 mt-4 font-semibold text-center`}>
              Need more assistance? Feel free to reach out through the Contact Us section.
            </Text>
          </ScrollView>
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



export default HelpModal;
