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

const loginSchema = z.object({
  username: z.string().nonempty({ message: "Username is required." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({ navigation }: any) {
  const {
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
      const storedUsers = await AsyncStorage.getItem("users");
      if (!storedUsers) {
        Alert.alert("Error", "No users found. Please sign up first.");
        return;
      }

      const users = JSON.parse(storedUsers);

      // Check if the user exists with matching username and password
      const user = users.find(
        (user: any) =>
          user.username === data.username && user.password === data.password
      );

      if (user) {
        Alert.alert("Success", "Logged in successfully!");
        navigation.replace("MainScreen", { username: data.username }); // Pass username to MainScreen
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
     

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>Login</Text>
        <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#555"
          style={styles.input}
          onChangeText={(text) => setValue("username", text)}
        />
        {errors.username && (
          <Text style={styles.error}>{errors.username.message}</Text>
        )}
</View>

<View style={styles.inputContainer}>
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
</View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("Signup")}
        >
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
    width: 150,
    height: 150,
    marginBottom: 40,
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
  }
});
