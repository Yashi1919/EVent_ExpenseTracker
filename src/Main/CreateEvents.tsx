import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import { z } from "zod";
import { Button } from "../Variants/RoundedBtn";
import { GradientText } from "../Variants/TextCva";

const eventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  expenseTypes: z.array(z.string()).min(3, "At least one expense type is required"),
  selectedDate: z.date().refine((date) => date >= new Date(), "Selected date must be in the future"),
});


export default function CreateEvents() {
  const route = useRoute();
  const { username } = route.params; // Get the username from route params

  const [events, setEvents] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]); // For expense types
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventName, setEventName] = useState("");
  const [newExpenseType, setNewExpenseType] = useState(""); // Adding new expense type
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpenseTypeModalVisible, setIsExpenseTypeModalVisible] = useState(false);

  const navigation = useNavigation(); // React Navigation hook

  // Load events for the current user from AsyncStorage
  const loadStorageData = async () => {
    try {
      const userData = await AsyncStorage.getItem(username); // Fetch data using username
      if (userData) {
        const parsedData = JSON.parse(userData);
        setEvents(parsedData.events || []); // Set events if they exist
      }
    } catch (error) {
      console.error("Failed to load data from AsyncStorage", error);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);


  

  const handleEventClick = (event) => {
    navigation.navigate("EventScreen", { event });
  };

  const handleLongPress = (event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.name}"?`, // Use backticks for template literals
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteEvent(event.id),
          style: "destructive",
        },
      ]
    );
  };
  
  const deleteEvent = async (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);

    try {
      const userData = await AsyncStorage.getItem(username);
      const parsedData = userData ? JSON.parse(userData) : { events: [] };
      parsedData.events = updatedEvents;

      await AsyncStorage.setItem(username, JSON.stringify(parsedData)); // Save updated events under username
      setEvents(updatedEvents);
      Alert.alert("Success", "Event deleted successfully.");
    } catch (error) {
      console.error("Failed to delete event from AsyncStorage", error);
    }
  };


  
  // Add a new expense type to the current list
  const addExpenseType = () => {
    if (!newExpenseType.trim()) {
      Alert.alert("Error", "Please provide a valid expense type.");
      return;
    }
    const updatedExpenseTypes = [...expenseTypes, newExpenseType];
    setExpenseTypes(updatedExpenseTypes);
    setNewExpenseType("");
    Alert.alert("Success", "Expense type added.");
  };

  // Remove an expense type from the list
  const removeExpenseType = (typeToRemove) => {
    const updatedExpenseTypes = expenseTypes.filter((type) => type !== typeToRemove);
    setExpenseTypes(updatedExpenseTypes);
    Alert.alert("Success", "Expense type removed.");
  };

  // Save a new event
  const saveEvent = async () => {
    // Validate using zod
    const validationResult = eventSchema.safeParse({
      eventName,
      expenseTypes,
      selectedDate,
    });

    if (!validationResult.success) {
      // Show error messages
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join("\n");
      Alert.alert("Validation Error", errorMessages);
      return;
    }

    const newEvent = {
      id: Date.now(),
      name: eventName,
      expenseTypes,
      date: selectedDate,
    };

    const updatedEvents = [...events, newEvent];

    try {
      const userData = await AsyncStorage.getItem(username);
      const parsedData = userData ? JSON.parse(userData) : { events: [] }; // Parse user data or initialize
      parsedData.events = updatedEvents;

      await AsyncStorage.setItem(username, JSON.stringify(parsedData)); // Save under username key
      setEvents(updatedEvents);
      resetEventForm();
      Alert.alert("Success", "Event added successfully!");
    } catch (error) {
      console.error("Failed to save event to AsyncStorage", error);
    }
  };

  // Reset form
  const resetEventForm = () => {
    setEventName("");
    setExpenseTypes([]);
    setSelectedDate(dayjs());
    setIsModalVisible(false);
  };

  

  return (
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


      {/* Horizontal Scrollable Event List */}
      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEventClick(item)}
            onLongPress={() => handleLongPress(item)} // Handle long press
            style={[
              tw`p-4 bg-white rounded-lg shadow mr-10`,
              { width: Dimensions.get("screen").width * 0.87 },
              { height: Dimensions.get("screen").height * 0.6 },
              {borderRadius:15,backgroundColor: "#6c63ff" ,}
            ]}
          >
            <Text style={[tw`text-lg font-bold text-gray-800 mb-2`,{color:"#ffffff",textAlign:"center"}]}>Event:-{item.name}</Text>
            
            <View style={[tw`flex-1 bg-white justify-center items-center`,{borderRadius:15}]}>
              <DateTimePicker
              mode="single"
             date={item.date}
             selectedRangeBackgroundColor="#ffffff"
            />
            </View>
            
            
            <Text style={[tw`text-sm font-semibold text-gray-800 mb-1`,{color:"#ffffff",fontSize:18,fontWeight:"bold",marginTop:15}]}>
              Expense Types
            </Text>
            <View style={tw`flex-row flex-wrap`}>
  {item.expenseTypes.map((type, index) => (
    <Text
      key={index}
      style={[tw`text-sm text-gray-600 mr-2`, { color: "#ffffff" }]}
    >
      {type}
    </Text>
  ))}
</View>
            </TouchableOpacity>
          
        )}
      />

      {/* Floating Button */}
      <Button
  intent="primary"
  size="rounded"
  gradientColors={["#6c63ff", "#4c669f"]}
  onPress={() => setIsModalVisible(true)}
  label={<MaterialIcons name="add" size={28} color="#fff" />} // Using the MaterialIcons component as the label
  className="shadow-lg"
  style={{
    marginBottom: 14, // Adding the marginBottom from the original code
    alignItems:"center"
  }}
/>


      {/* Modal for Adding Events */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => resetEventForm()}
      >
        <KeyboardAvoidingView
          style={tw`flex-1 justify-center items-center bg-black/50`}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={tw`w-4/5 bg-white p-5 rounded-lg shadow-lg`}>
            <Text style={tw`text-xl font-bold text-center mb-3 text-gray-800`}>
              Add Event
            </Text>

            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="Event Name"
              placeholderTextColor="#000"
              value={eventName}
              onChangeText={setEventName}
            />

<DateTimePicker
  mode="single"
  date={selectedDate}
  onChange={(params) => setSelectedDate(new Date(params.date))} // Convert to Date
  style={tw`mb-3`}
/>


            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="Add Expense Type"
              placeholderTextColor="#000"
              value={newExpenseType}
              onChangeText={setNewExpenseType}
            />
            <TouchableOpacity
              style={tw`bg-green-600 py-2 rounded-lg mb-2`}
              onPress={addExpenseType}
            >
              <Text style={tw`text-center text-white font-bold`}>Add Expense Type</Text>
            </TouchableOpacity>

            <FlatList
              data={expenseTypes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-sm text-gray-700`}>{item}</Text>
                  <TouchableOpacity onPress={() => removeExpenseType(item)}>
                    <MaterialIcons name="delete" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity
              style={tw`bg-blue-600 py-2 rounded-lg mb-2`}
              onPress={saveEvent}
            >
              <Text style={tw`text-center text-white font-bold`}>Save Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-gray-600 py-2 rounded-lg`}
              onPress={() => resetEventForm()}
            >
              <Text style={tw`text-center text-white font-bold`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
