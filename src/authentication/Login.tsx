import React from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = z.object({
  username: z.string().nonempty({ message: "Username is required." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({ navigation }: any) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Error", "No user found. Please sign up first.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === data.username && parsedUser.password === data.password) {
        Alert.alert("Success", "Logged in successfully!");
        navigation.replace("MainScreen"); // Replace the current stack
      } else {
        Alert.alert("Error", "Invalid username or password.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={require("../assets/logo.jpg")} // Replace with the path to your logo image
        style={styles.logo}
      />

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>Login</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#555"
          style={styles.input}
          onChangeText={(text) => setValue("username", text)}
        />
        {errors.username && (
          <Text style={styles.error}>{errors.username.message}</Text>
        )}

        <TextInput
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          style={styles.input}
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>Don’t have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 150, // Adjust logo width
    height: 150, // Adjust logo height
    marginBottom: 40, // Space between the logo and the login card
  },
  card: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6c63ff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#6c63ff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
