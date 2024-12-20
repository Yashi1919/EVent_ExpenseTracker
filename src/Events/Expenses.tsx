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
import { z } from "zod";
import { GradientText } from "../Variants/TextCva";

const expenseSchema = z.object({
  selectedExpenseType: z.string().nonempty("Expense type is required."),
  amount: z
    .string()
    .nonempty("Amount is required.")
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number."),
  message: z.string().optional(),
  photo: z.string().nullable().optional(),
});


const Expenses: React.FC<{ event: any }> = ({ event }) => {
  const [eventData, setEventData] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(null);

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
        Alert.alert("Event added Go Back and Come Again");
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
    try {
      const validationResult = expenseSchema.safeParse({
        selectedExpenseType,
        amount,
        message,
        photo,
      });
  
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors
          .map((err) => err.message)
          .join("\n");
        Alert.alert( errorMessages);
        return;
      }
  

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
      <View style={tw`flex-1 p-5 bg-gray-100`}>
      <GradientText
        fontSize={24}
        fontWeight="bold"
        colors={["#ff7e5f", "#6c63ff"]}
        align="center"
        width={300}
      >
        Your Events
      </GradientText>
      
    
      {/* Event Name and Total Amount */}
      <View
        style={[
          tw`mb-5 bg-[#6c63ff] rounded-lg p-4 shadow items-center justify-center w-11/12 h-1/4 self-center mt-5`,
        ]}
      >
        <Text style={[tw`text-xl font-bold text-white text-center mb-2`,{color:"#ffffff"}]}>
          {eventData.name}
        </Text>
        <Text style={tw`text-lg font-semibold text-white`}>
          Total Amount: {eventData.totalAmount.toFixed(2)} rs
        </Text>
      </View>
      </View>
      {/* Floating Add Button */}
      <TouchableOpacity
        style={tw`absolute rounded-full items-center justify-center shadow-lg bg-[#6c63ff] self-center w-[150px] h-[150px] bottom-[180px]`}

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
