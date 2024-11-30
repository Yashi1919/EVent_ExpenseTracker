import React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { Button } from "../Variants/ButtonExample";
import { Input } from "../Variants/InputCva";

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
    <View style={tw`flex-1 justify-center items-center bg-white`}>
    

      <View style={tw`w-4/5 bg-white rounded-lg p-5 shadow-lg`}>
      <Text style={tw`text-2xl font-bold text-center mb-5 text-indigo-600`}>
          Login
        </Text>

        <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 mb-4`}>
        <Input
  placeholder="Enter your username"
  placeholderTextColor="#6c63ff"
  intent="default"
  theme="dark"
  onChangeText={(text) => setValue("username", text)}
  style={{color:"#000000"}}
/>


        </View>
        {errors.username && (
          <Text style={tw`text-red-500 text-sm mb-2`}>{errors.username.message}</Text>
        )}

        <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 mb-4`}>
        <Input
  placeholder="Enter your password"
  placeholderTextColor="#6c63ff"
  intent="default"
  theme="dark"
  onChangeText={(text) => setValue("password", text)}
  style={{color:"#000000"}}
/>
        </View>
        {errors.password && (
          <Text style={tw`text-red-500 text-sm mb-2`}>{errors.password.message}</Text>
        )}

        
          <Button
  intent="primary"
  size="large"
  gradientColors={["#ff7e5f", "#6c63ff"]}
  label="Login"
  onPress={handleSubmit(onSubmit)}
  
/>

        <TouchableOpacity
          style={tw`mt-4 items-center`}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={tw`text-indigo-600 text-base font-bold`}>
            Don’t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
