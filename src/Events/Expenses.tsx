import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tw from "twrnc";
import ImagePicker from "react-native-image-crop-picker";

const Expenses: React.FC<{ event: any }> = ({ event }) => {
  const [eventData, setEventData] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);

  // Load full event data from AsyncStorage
  const loadEventData = async () => {
    try {
      const storedEvent = await AsyncStorage.getItem(event.name);
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);

        // Ensure all expected fields are initialized
        const updatedEventData = {
          ...parsedEvent,
          history: parsedEvent.history || [],
          totalAmount: parsedEvent.totalAmount || 0,
        };

        setEventData(updatedEventData);
      } else {
        Alert.alert("Event not found", "Please wait while we fetch the details.");
      }
    } catch (error) {
      console.error("Failed to load event data from AsyncStorage", error);
      Alert.alert("Error", "Failed to load event data.");
    }
  };

  // Reload data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadEventData();
    }, [])
  );

  const handleSaveToHistory = async () => {
    if (!selectedExpenseType || !amount || isNaN(Number(amount))) {
      Alert.alert("Error", "Please provide valid expense details.");
      return;
    }

    const expenseAmount = parseFloat(amount);

    // Check if sufficient amount is available
    if (expenseAmount > eventData.totalAmount) {
      Alert.alert("Error", "Insufficient funds. Cannot make this expense.");
      return;
    }

    const newExpense = {
      type: selectedExpenseType, // Add expense type
      amount: expenseAmount,
      message,
      photo,
    };

    const updatedHistory = [...(eventData.history || []), newExpense];
    const updatedTotalAmount = eventData.totalAmount - expenseAmount;

    const updatedEventData = {
      ...eventData,
      history: updatedHistory, // Save history with the expense type
      totalAmount: updatedTotalAmount,
    };

    try {
      await AsyncStorage.setItem(event.name, JSON.stringify(updatedEventData));
      setEventData(updatedEventData);
      setIsModalVisible(false);
      setSelectedExpenseType("");
      setAmount("");
      setMessage("");
      setPhoto(null);
      Alert.alert("Success", "Expense saved to history.");
    } catch (error) {
      console.error("Failed to save expense to history", error);
      Alert.alert("Error", "Failed to save expense to history.");
    }
  };

  const handleImagePick = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((image) => {
        setPhoto(image.path);
      })
      .catch((error) => {
        console.error("Failed to pick image", error);
        Alert.alert("Error", "Failed to pick image.");
      });
  };

  if (!eventData) {
    return (
      <View style={tw`flex-1 bg-gray-100 p-5 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-600`}>Loading event data...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Event Name and Total Amount */}
      <View
        style={[
          tw`mb-5 bg-purple-200 rounded-lg p-4 shadow items-center justify-center`,
          { width: "90%", height: "25%", alignSelf: "center", marginTop: 20 },
        ]}
      >
        <Text style={tw`text-xl font-bold text-gray-800 text-center`}>
          {eventData.name}
        </Text>
        <Text style={tw`text-lg text-gray-700 mt-3 text-center`}>
          Total Amount: {eventData.totalAmount.toFixed(2)} rs
        </Text>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[
          tw`absolute bg-purple-600 rounded-full items-center justify-center shadow-lg`,
          {
            width: 60,
            height: 60,
            bottom: 90,
            left: "50%",
            transform: [{ translateX: -30 }],
          },
        ]}
        onLongPress={() => setIsModalVisible(true)} // Open modal on long press
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Adding Expense */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`w-4/5 bg-white p-5 rounded-lg shadow-lg`}>
            <Text style={tw`text-xl font-bold text-center mb-4 text-gray-800`}>
              Save Expense to History
            </Text>

            <Text style={tw`text-gray-700 mb-2`}>Select Expense Type:</Text>
            <FlatList
              data={eventData.expenseTypes}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    tw`px-3 py-2 rounded-lg mr-2`,
                    item === selectedExpenseType
                      ? tw`bg-purple-600`
                      : tw`bg-gray-300`,
                  ]}
                  onPress={() => setSelectedExpenseType(item)}
                >
                  <Text
                    style={[
                      tw`text-center font-bold`,
                      item === selectedExpenseType
                        ? tw`text-white`
                        : tw`text-gray-800`,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={tw`text-gray-700 mt-4`}>Amount:</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={tw`text-gray-700`}>Message:</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="Enter message"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity
              style={tw`bg-purple-600 py-2 rounded-lg mb-3`}
              onPress={handleImagePick}
            >
              <Text style={tw`text-center text-white font-bold`}>
                Upload Proof
              </Text>
            </TouchableOpacity>

            {photo && (
              <Image
                source={{ uri: photo }}
                style={tw`w-32 h-32 rounded-lg mb-3 self-center`}
              />
            )}

            <TouchableOpacity
              style={tw`bg-blue-600 py-2 rounded-lg mb-2`}
              onPress={handleSaveToHistory} // Save to history
            >
              <Text style={tw`text-center text-white font-bold`}>
                Save to History
              </Text>
            </TouchableOpacity>
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

export default Expenses;
