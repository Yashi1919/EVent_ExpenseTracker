import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/authentication/Login";
import Signup from "./src/authentication/Signup";
import MainScreen from "./src/Main/MainScreen";
import EventScreen from "./src/Events/EventScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="EventScreen" component={EventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
