import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tw from "twrnc";//tailwind React native classes 
import { GradientText } from "../Variants/TextCva";

import { z } from "zod"; 

const fundraiserSchema = z.object({
  fundraiserName: z.string().min(1, "Fundraiser name is required."),
  amount: z
    .string()
    .nonempty("Amount is required.")
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number."),
});


const Fundraisers: React.FC<{ event: any }> = ({ event }) => {
  const [searchText, setSearchText] = useState("");
  const [fundraisers, setFundraisers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fundraiserName, setFundraiserName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadEventData();
  }, []);

  const loadEventData = async () => {
    try {
      const storedEvent = await AsyncStorage.getItem(event.name);
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);
        setFundraisers(parsedEvent.fundraisers || []);
      }
    } catch (error) {
      console.error("Failed to load event data", error);
      Alert.alert("Error", "Failed to load event data.");
    }
  };

  const handleAddFundraiser = async () => {

    const validationResult = fundraiserSchema.safeParse({
      fundraiserName,
      amount,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join("\n");
      Alert.alert("Validation Error", errorMessages);
      return;
    }

  

    const newFundraiser = {
      name: fundraiserName,
      amount: parseFloat(amount),
    };

    try {
      const storedEvent = await AsyncStorage.getItem(event.name);
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);

        // Update fundraisers and totalAmount
        const updatedFundraisers = [...(parsedEvent.fundraisers || []), newFundraiser];
        const updatedTotalAmount = (parsedEvent.totalAmount || 0) + newFundraiser.amount;

        const updatedEventData = {
          ...parsedEvent,
          fundraisers: updatedFundraisers,
          totalAmount: updatedTotalAmount,
        };

        // Save updated event data to AsyncStorage
        await AsyncStorage.setItem(event.name, JSON.stringify(updatedEventData));

        // Update local state
        setFundraisers(updatedFundraisers);
        setIsModalVisible(false);
        setFundraiserName("");
        setAmount("");

        Alert.alert("Success", "Fundraiser added successfully.");
      } else {
        Alert.alert("Error", "Failed to load event data.");
      }
    } catch (error) {
      console.error("Failed to save fundraiser", error);
      Alert.alert("Error", "Failed to save fundraiser.");
    }
  };

  const filteredFundraisers = fundraisers.filter((fundraiser) =>
    fundraiser.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw` p-5 bg-gray-100`}>
      <GradientText
        fontSize={24}
        fontWeight="bold"
        colors={["#ff7e5f", "#6c63ff"]}
        align="center"
        width={300}
      >
        Fundraisers
      </GradientText>
      </View>

      {/* Search Bar with Add Button */}
      <View style={tw`flex-row items-center p-4 bg-gray-200`}>
        <TextInput
          style={[tw`flex-1 border border-gray-400 rounded px-3 py-4 bg-white rounded-lg`]}
          placeholder="Search fundraisers..."
          placeholderTextColor="#6c63ff"
          value={searchText}
          onChangeText={setSearchText}
          
        />
        <TouchableOpacity
          style={[tw`bg-[#6c63ff] p-3 ml-2 rounded-lg`]}
          onPress={() => setIsModalVisible(true)} // Open modal on button press
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Fundraisers List */}
      <FlatList
        data={filteredFundraisers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={tw`flex-row justify-between items-center bg-white p-6 rounded-lg mb-2 shadow`}
          >
            <View>
              <Text style={[tw`text-lg font-bold text-gray-800 text-[#6c63ff]`]}>{item.name}</Text>
            </View>
            <Text style={tw`text-gray-800 font-bold`}>₹{item.amount.toFixed(2)}</Text>
          </View>
        )}
        contentContainerStyle={tw`p-4`}
      />

      {/* Modal for Adding Fundraiser */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`w-4/5 bg-white p-5 rounded-lg shadow-lg`}>
            <Text style={tw`text-xl font-bold text-center mb-4 text-gray-800`}>
              Add Fundraiser
            </Text>

            {/* Fundraiser Name */}
            <Text style={tw`text-gray-700 mb-2`}>Name:</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="Enter fundraiser name"
              value={fundraiserName}
              onChangeText={setFundraiserName}
            />

            {/* Amount */}
            <Text style={tw`text-gray-700 mb-2`}>Amount:</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            {/* Save Button */}
            <TouchableOpacity
              style={tw`bg-green-600 py-2 rounded-lg mb-3`}
              onPress={handleAddFundraiser}
            >
              <Text style={tw`text-center text-white font-bold`}>Save Fundraiser</Text>
            </TouchableOpacity>
            {/* Cancel Button */}
            <TouchableOpacity
              style={tw`bg-gray-600 py-2 rounded-lg`}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={tw`text-center text-white font-bold`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Fundraisers;
