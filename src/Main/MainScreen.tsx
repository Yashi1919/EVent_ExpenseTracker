import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function MainScreen({ navigation }: any) {
  const handleLogout = async () => {
    navigation.replace("Login"); // Replace the current stack to prevent back navigation to MainScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Main Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
