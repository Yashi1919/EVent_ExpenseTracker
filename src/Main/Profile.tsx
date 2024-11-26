import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker"; // Image picker for uploading and cropping photos
import tw from "twrnc"; // Tailwind classes for styling

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [eventCount, setEventCount] = useState(0);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userProfile");
      if (storedData) {
        const { profileImage, userName, eventCount } = JSON.parse(storedData);
        setProfileImage(profileImage || null);
        setUserName(userName || "");
        setEventCount(eventCount || 0);
      }
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error);
    }
  };

  // Save user data to AsyncStorage
  const saveUserData = async () => {
    try {
      const userData = { profileImage, userName, eventCount };
      await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save user data to AsyncStorage:", error);
    }
  };

  // Upload and crop image using react-native-image-crop-picker
  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.8,
      });
      setProfileImage(image.path);
    } catch (error) {
      if (error.message !== "User cancelled image selection") {
        console.error("Error selecting image:", error);
        Alert.alert("Error", "Failed to select image.");
      }
    }
  };

  // Load user data when the component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-center mb-5 text-gray-800`}>
        Profile
      </Text>

      {/* Profile Image */}
      <TouchableOpacity onPress={handleImageUpload} style={tw`items-center mb-5`}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={tw`w-32 h-32 rounded-full border-2 border-purple-600`}
          />
        ) : (
          <View
            style={tw`w-32 h-32 rounded-full bg-gray-300 items-center justify-center border-2 border-purple-600`}
          >
            <MaterialIcons name="person" size={48} color="#6b7280" />
          </View>
        )}
        <Text style={tw`text-sm text-gray-600 mt-2`}>Tap to upload image</Text>
      </TouchableOpacity>

      {/* Username Input */}
      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-3`}
        placeholder="Enter your name"
        placeholderTextColor="#000000"
        value={userName}
        onChangeText={setUserName}
      />

      {/* Event Count Display */}
      <View style={tw`mb-5`}>
        <Text style={tw`text-lg font-semibold text-gray-700`}>
          Total Events Created: {eventCount}
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={tw`bg-green-600 py-2 rounded-lg mb-3`}
        onPress={saveUserData}
      >
        <Text style={tw`text-center text-white font-bold`}>Save Profile</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={tw`bg-red-500 py-2 rounded-lg`}
        onPress={() => {
          AsyncStorage.clear();
          Alert.alert("Logged Out", "You have been logged out successfully.");
        }}
      >
        <Text style={tw`text-center text-white font-bold`}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
