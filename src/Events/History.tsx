import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import tw from "twrnc";
import { Image } from "react-native";

const History: React.FC<{ event: any }> = ({ event }) => {
  const [eventData, setEventData] = useState<any>(null);

  // Load event data from AsyncStorage
  const loadEventData = async () => {
    try {
      const storedEvent = await AsyncStorage.getItem(event.name);
      console.log(storedEvent)
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);

        // Ensure all expected fields are initialized
        const updatedEventData = {
          ...parsedEvent,
          history: parsedEvent.history || [],
          fundraisers: parsedEvent.fundraisers || [],
          expenseTypes: parsedEvent.expenseTypes || [],
        };

        setEventData(updatedEventData);
      } else {
        Alert.alert("Error", "Failed to load event data.");
      }
    } catch (error) {
      console.error("Failed to load event data", error);
      Alert.alert("Error", "Failed to load event data.");
    }
  };

  // Use useFocusEffect to reload data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadEventData();
    }, [])
  );

  if (!eventData) {
    return (
      <View style={tw`flex-1 bg-gray-100 p-5 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-600`}>Loading event data...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={[tw`bg-purple-200 py-4`,{backgroundColor:"#6c63ff"}]}>
        <Text style={[tw`text-lg font-bold text-gray-800 text-center`,{color:"#ffffff"}]}>
          History
        </Text>
      </View>

      {/* Content wrapped in ScrollView */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* Event Summary */}
        <View style={[styles.summaryContainer, tw`p-4 mb-4 rounded-lg shadow`,{backgroundColor:"#6c63ff"}]}>
          <Text style={[tw`text-lg font-bold text-gray-800`,{color:"white"}]}>
            Name: {eventData.name}
          </Text>
          <Text style={[tw`text-gray-700`,{color:"white"}]}>Date: {eventData.date}</Text>
          <Text style={[tw`text-gray-700`,{color:"white"}]}>
            Total Amount: ₹{eventData.totalAmount.toFixed(2)}
          </Text>
          <Text style={[tw`text-gray-700`,{color:"white"}]}>
            Expense Types: {eventData.expenseTypes.join(", ")}
          </Text>
        </View>

        {/* Fundraisers List */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>Fundraisers</Text>
          <FlatList
            data={eventData.fundraisers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.fundraiserItem, tw`p-4 mb-2 rounded-lg shadow`]}>
                <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
                <Text style={tw`text-gray-700`}>₹{item.amount.toFixed(2)}</Text>
              </View>
            )}
            scrollEnabled={false} // Prevent FlatList from scrolling inside ScrollView
          />
        </View>

        {/* History List */}
        <View>
          <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>History</Text>
          <FlatList
            data={eventData.history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.historyItem, tw`p-4 mb-2 rounded-lg shadow`]}>
                <Text style={tw`text-lg font-bold text-gray-800`}>{item.type}</Text>
                <Text style={tw`text-gray-700`}>Amount: ₹{item.amount.toFixed(2)}</Text>
                {item.message && (
                  <Text style={tw`text-gray-600`}>Message: {item.message}</Text>
                )}
              {item.photo?(
                 <Image
            source={{ uri: item.photo }}
            style={[tw`w-32 h-32  border-2 border-purple-600`,{borderRadius:8}]}
          />):<Text>No Proof Uploaded</Text>}
              </View>
            )}
            scrollEnabled={false} // Prevent FlatList from scrolling inside ScrollView
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: "#E6E6FA", // Light lavender background for summary
  },
  fundraiserItem: {
    backgroundColor: "#DFF6DD", // Light green background for fundraisers
  },
  historyItem: {
    backgroundColor: "#FDE2E2", // Light red background for history
  },
});

export default History;
