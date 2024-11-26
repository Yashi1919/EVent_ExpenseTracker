import React, { useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Import screens
import Expenses from "./Expenses";
import Fundraisers from "./FundRaisers";
import Statistics from "./Statistics";
import History from "./History";

// Define the tab navigator
const Tab = createBottomTabNavigator();

// Define the type for route params
type EventRouteParams = {
  event: {
    id: number;
    name: string;
    date: string;
    expenseTypes: string[];
  };
};

const EventScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, EventRouteParams>, string>>();
  const { event } = route.params; // Extract the event details from the route params

  // Save event details in AsyncStorage if not already present
  const saveEventToStorage = async () => {
    try {
      const storedEvent = await AsyncStorage.getItem(event.name);
      if (!storedEvent) {
        const eventData = {
          name: event.name,
          date: event.date,
          expenseTypes: event.expenseTypes,
          totalAmount: 0, // Initialize totalAmount to 0
          history: [], // Initialize with an empty history
          fundraisers: [], // Initialize with an empty fundraisers list
          volunteers: [], // Initialize with an empty volunteers list
        };

        await AsyncStorage.setItem(event.name, JSON.stringify(eventData));
        console.log(`Event ${event.name} saved to storage.`);
      } else {
        console.log(`Event ${event.name} already exists in storage.`);
      }
    } catch (error) {
      console.error("Failed to save event data to AsyncStorage", error);
    }
  };

  // Use useFocusEffect to save data when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      saveEventToStorage();
      // Additional logic can be added here if needed
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === "Expenses") {
            iconName = "attach-money";
          } else if (route.name === "Fundraisers") {
            iconName = "volunteer-activism";
          } else if (route.name === "Statistics") {
            iconName = "bar-chart";
          } else if (route.name === "History") {
            iconName = "history";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: tw`bg-white border-t border-gray-200`,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Expenses"
        options={{ title: "Expenses" }}
      >
        {() => <Expenses event={event} />}
      </Tab.Screen>
      <Tab.Screen
        name="Fundraisers"
        options={{ title: "Fundraisers" }}
      >
        {() => <Fundraisers event={event} />}
      </Tab.Screen>
      <Tab.Screen
        name="Statistics"
        options={{ title: "Statistics" }}
      >
        {() => <Statistics event={event} />}
      </Tab.Screen>
      <Tab.Screen
        name="History"
        options={{ title: "History" }}
      >
        {() => <History event={event} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default EventScreen;
 