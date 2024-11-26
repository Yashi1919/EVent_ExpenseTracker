import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native"; // For navigation

export default function ActiveEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigation = useNavigation(); // Initialize navigation

  // Load events from AsyncStorage and filter them
  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("events");
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
        filterActiveEvents(parsedEvents);
      } else {
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error("Failed to load events from AsyncStorage", error);
    }
  };

  // Filter events that are within 15 days from the current date
  const filterActiveEvents = (allEvents) => {
    const today = dayjs();
    const activeEvents = allEvents.filter((event) => {
      const eventDate = dayjs(event.date, "YYYY-MM-DD");
      return eventDate.isAfter(today) && eventDate.diff(today, "day") <= 15;
    });
    setFilteredEvents(activeEvents);
  };

  // Delete an event
  const deleteEvent = async (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    try {
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      filterActiveEvents(updatedEvents); // Update filtered events
      Alert.alert("Success", "Event deleted successfully.");
    } catch (error) {
      console.error("Failed to delete event from AsyncStorage", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-center mb-5 text-gray-800`}>
        Active Events
      </Text>

      {filteredEvents.length === 0 ? (
        <Text style={tw`text-lg text-center text-gray-600 mt-5`}>
          No active events available.
        </Text>
      ) : (
        <View style={tw`h-[60%]`}>
          <FlatList
            data={filteredEvents}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EventScreen", { event: item })
                }
                style={[
                  tw`p-4 bg-white rounded-lg shadow mr-4`,
                  { width: Dimensions.get("screen").width * 0.8 },
                ]}
              >
                <View>
                  <Text style={tw`text-lg font-bold text-gray-800`}>
                    {item.name}
                  </Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    Date: {dayjs(item.date).format("DD/MM/YYYY")}
                  </Text>
                  <FlatList
                    data={item.expenses}
                    keyExtractor={(expense) => expense.id.toString()}
                    renderItem={({ item: expense }) => (
                      <Text style={tw`text-sm text-gray-600 pl-2`}>
                        - {expense.name}
                      </Text>
                    )}
                  />
                </View>
                <TouchableOpacity
                  style={tw`mt-2 p-2 bg-red-500 rounded-lg`}
                  onPress={() => deleteEvent(item.id)}
                >
                  <Text style={tw`text-white text-center font-semibold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
