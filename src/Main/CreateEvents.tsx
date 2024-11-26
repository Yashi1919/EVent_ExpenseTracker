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
import { useNavigation } from "@react-navigation/native";

export default function CreateEvents() {
  const [events, setEvents] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]); // For expense types
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventName, setEventName] = useState("");
  const [newExpenseType, setNewExpenseType] = useState(""); // Adding new expense type
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpenseTypeModalVisible, setIsExpenseTypeModalVisible] = useState(false);

  const navigation = useNavigation(); // React Navigation hook

  // Load events from AsyncStorage
  const loadStorageData = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("events");
      if (storedEvents) setEvents(JSON.parse(storedEvents));
    } catch (error) {
      console.error("Failed to load data from AsyncStorage", error);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

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

  // Save a new event
  const saveEvent = async () => {
    if (!eventName.trim() || expenseTypes.length === 0 || !selectedDate) {
      Alert.alert("Error", "Please provide all required fields.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      name: eventName,
      expenseTypes,
      date: selectedDate.format("YYYY-MM-DD"),
    };

    const updatedEvents = [...events, newEvent];

    try {
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
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

  // Delete an event
  const deleteEvent = async (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);

    try {
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      Alert.alert("Success", "Event deleted successfully.");
    } catch (error) {
      console.error("Failed to delete event from AsyncStorage", error);
    }
  };

  // Handle long press to delete event
  const handleLongPress = (event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.name}"?`,
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

  // Navigate to event screen
  const handleEventClick = (event) => {
    navigation.navigate("EventScreen", { event });
  };

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-center mb-5 text-gray-800`}>
        Create Events
      </Text>

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
              tw`p-4 bg-white rounded-lg shadow mr-4`,
              { width: Dimensions.get("screen").width * 0.86 },
              { height: Dimensions.get("screen").height * 0.5 },
            ]}
          >
            <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>{item.name}</Text>
            <Text style={tw`text-sm text-gray-600 mb-2`}>
              Date: {dayjs(item.date).format("DD/MM/YYYY")}
            </Text>
            <Text style={tw`text-sm font-semibold text-gray-800 mb-1`}>
              Expense Types:
            </Text>
            {item.expenseTypes.length === 0 ? (
              <Text style={tw`text-sm text-gray-600`}>No expense types added.</Text>
            ) : (
              item.expenseTypes.map((type, index) => (
                <Text key={index} style={tw`text-sm text-gray-600`}>
                  - {type}
                </Text>
              ))
            )}
          </TouchableOpacity>
        )}
      />

      {/* Floating Button */}
      <TouchableOpacity
        style={tw`absolute bottom-5 right-5 bg-purple-600 w-14 h-14 rounded-full justify-center items-center shadow-lg`}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

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
              onChange={(params) => setSelectedDate(params.date)}
              style={tw`mb-3`}
            />

            <TouchableOpacity
              style={tw`bg-purple-600 py-2 rounded-lg mb-2`}
              onPress={() => setIsExpenseTypeModalVisible(true)}
            >
              <Text style={tw`text-center text-white font-bold`}>
                Add Expense Types
              </Text>
            </TouchableOpacity>

            <FlatList
              data={expenseTypes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={tw`text-sm text-gray-700`}>- {item}</Text>
              )}
            />

            <TouchableOpacity
              style={tw`bg-green-600 py-2 rounded-lg mb-2`}
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

      {/* Modal for Managing Expense Types */}
      <Modal
        visible={isExpenseTypeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsExpenseTypeModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={tw`flex-1 justify-center items-center bg-black/50`}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={tw`w-4/5 bg-white p-5 rounded-lg shadow-lg`}>
            <Text style={tw`text-xl font-bold text-center mb-3 text-gray-800`}>
              Manage Expense Types
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-2 mb-3`}
              placeholder="New Expense Type"
              placeholderTextColor="#000"
              value={newExpenseType}
              onChangeText={setNewExpenseType}
            />
            <TouchableOpacity
              style={tw`bg-green-600 py-2 rounded-lg mb-2`}
              onPress={addExpenseType}
            >
              <Text style={tw`text-center text-white font-bold`}>Add Type</Text>
            </TouchableOpacity>

            <FlatList
              data={expenseTypes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={tw`text-sm text-gray-700`}>- {item}</Text>
              )}
            />

            <TouchableOpacity
              style={tw`bg-gray-600 py-2 rounded-lg`}
              onPress={() => setIsExpenseTypeModalVisible(false)}
            >
              <Text style={tw`text-center text-white font-bold`}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
