import React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup({ navigation }: any) {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if username already exists
      if (users.some((user: any) => user.username === data.username)) {
        Alert.alert("Error", "Username already exists. Please choose another one.");
        return;
      }

      // Add new user to the list
      const updatedUsers = [...users, data];
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to save user details.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
     

      {/* Signup Form */}
      <View style={styles.card}>
        <Text style={styles.heading}>Signup</Text>
        <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#555"
          style={styles.input}
          onChangeText={(text) => setValue("username", text)}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          style={styles.input}
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
    </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    marginBottom: 40, // Space between the logo and the form card
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
    color: "#6c63ff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f9f9f9",
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
