import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ActiveEvents from "./ActiveEvents";
import CreateEvents from "./CreateEvents";
import Profile from "./Profile";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Create bottom tabs
const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ActiveEvents") {
            iconName = focused ? "event" : "event-note";
          } else if (route.name === "CreateEvents") {
            iconName = focused ? "add-box" : "add";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "person-outline";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6c63ff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#cccccc",
        },
        headerShown: false, // Disable header for all tabs
      })}
    >
      <Tab.Screen name="CreateEvents" component={CreateEvents} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

