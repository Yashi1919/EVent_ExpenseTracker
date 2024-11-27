import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import tw from "twrnc";

const Statistics: React.FC<{ event: any }> = ({ event }) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  // Load event data from AsyncStorage
  const loadExpenses = async () => {
    try {
      const storedEvent = await AsyncStorage.getItem(event.name);
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);

        // Ensure history exists and calculate total expense
        const eventHistory = parsedEvent.history || [];
        const total = eventHistory.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);

        setExpenses(eventHistory);
        setTotalExpense(total);
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
      loadExpenses();
    }, [])
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={[tw`bg-purple-200 py-4`,{backgroundColor:"#6c63ff"}]}>
        <Text style={[tw`text-lg font-bold text-gray-800 text-center`,{color:"white"}]}>
          Statistics
        </Text>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: "#E6E6FA", // Light lavender background for summary
  },
  expenseItem: {
    backgroundColor: "#FDE2E2", // Light red background for expenses
  },
});

export default Statistics;
