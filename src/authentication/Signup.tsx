import React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";

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
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      {/* Signup Form */}
      <View style={tw`w-4/5 bg-white rounded-lg p-5 shadow-lg`}>
        <Text style={tw`text-2xl font-bold text-center mb-5 text-indigo-600`}>
          Signup
        </Text>

        <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-100`}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#555"
            style={tw`flex-1 text-base text-black`}
            onChangeText={(text) => setValue("username", text)}
          />
        </View>
        {errors.username && (
          <Text style={tw`text-red-500 text-sm mb-2`}>
            {errors.username.message}
          </Text>
        )}

        <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-100`}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            secureTextEntry
            style={tw`flex-1 text-base text-black`}
            onChangeText={(text) => setValue("password", text)}
          />
        </View>
        {errors.password && (
          <Text style={tw`text-red-500 text-sm mb-2`}>
            {errors.password.message}
          </Text>
        )}

        <TouchableOpacity
          style={tw`bg-indigo-600 py-3 rounded-lg items-center mt-2`}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={tw`text-white text-lg font-bold`}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`mt-4 items-center`}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={tw`text-indigo-600 text-lg font-bold`}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
