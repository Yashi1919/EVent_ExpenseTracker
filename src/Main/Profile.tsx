import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker"; // Image picker for uploading and cropping photos
import tw from "twrnc"; // Tailwind classes for styling
import { useRoute, useNavigation } from "@react-navigation/native";
import AboutAppModal from "../Modals/AboutAppModal";
import HelpModal from "../Modals/HelpModal";
import PremiumModal from "../Modals/PremiumModal";
import ContactUsModal from "../Modals/ContactUsModal";

export default function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username } = route.params; // Get the username from route params

  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [eventCount, setEventCount] = useState(0);

  const profileKey = `${username}profile`; // Create a unique key for this user's profile

  const [aboutVisible, setAboutVisible] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);

  const loadUserCount = async () => {
    try {
      const countData = await AsyncStorage.getItem(username);
      if (countData) {
        const data = JSON.parse(countData);
        console.log(data["events"].length);
        setEventCount(data["events"].length);
      }
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error);
    }
  };

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(profileKey);
      if (storedData) {
        const { profileImage, userName } = JSON.parse(storedData);
        setProfileImage(profileImage || null);
        setUserName(userName || "");
      }
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error);
    }
  };

  // Save user data to AsyncStorage
  const saveUserData = async () => {
    try {
      const userData = { profileImage, userName, eventCount };
      await AsyncStorage.setItem(profileKey, JSON.stringify(userData));
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
    loadUserCount();
  }, []);

  useFocusEffect(() => {
    loadUserData();
    loadUserCount();
  });

  return (
    <ScrollView>
      <View style={tw`flex-1 p-5 bg-gray-100`}>
        <Text style={tw`text-2xl font-bold text-center mb-5 text-purple-600`}>
          Profile
        </Text>

        {/* Profile Image */}
        <View style={tw`flex-row justify-between items-center p-4 bg-gray-100 rounded-lg shadow-lg`}>
          <TextInput
            style={tw`rounded p-2 mb-3 font-bold text-2xl text-purple-600`}
            placeholder="Enter your name"
            placeholderTextColor="#6c63ff"
            value={userName}
            onChangeText={setUserName}
          />
          <TouchableOpacity onPress={handleImageUpload} style={tw`items-center mb-5`}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={tw`w-32 h-32 border-2 border-purple-600 rounded-lg`}
              />
            ) : (
              <View
                style={tw`w-32 h-32 rounded-full bg-gray-300 items-center justify-center border-2 border-purple-600`}
              >
                <MaterialIcons name="person" size={48} color="#6b7280" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`bg-green-600 py-2 rounded-lg mb-3`}
          onPress={saveUserData}
        >
          <Text style={tw`text-center text-white font-bold`}>Save Profile</Text>
        </TouchableOpacity>

        <View style={tw`w-full bg-white p-4 rounded-lg shadow-lg mb-1 mt-1`}>
          <Text style={tw`text-lg font-semibold text-gray-700`}>
            Total Events Created: {eventCount}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setAboutVisible(true)}>
          <View style={tw`w-full bg-white p-4 rounded-lg shadow-lg mt-2`}>
            <Text style={tw`text-lg font-semibold text-gray-700`}>About App</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPremiumVisible(true)}>
          <View style={tw`w-full bg-white p-4 rounded-lg shadow-lg mt-2`}>
            <Text style={tw`text-lg font-semibold text-gray-700`}>Premium</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setContactVisible(true)}>
          <View style={tw`w-full bg-white p-4 rounded-lg shadow-lg mt-2`}>
            <Text style={tw`text-lg font-semibold text-gray-700`}>Contact Us</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setHelpVisible(true)}>
          <View style={tw`w-full bg-white p-4 rounded-lg shadow-lg mt-2`}>
            <Text style={tw`text-lg font-semibold text-gray-700`}>Help</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-red-500 py-2 rounded-lg mt-2`}
          onPress={() => {
            navigation.navigate("Login");
            Alert.alert("Logged Out", "You have been logged out successfully.");
          }}
        >
          <Text style={tw`text-center text-white font-bold`}>Logout</Text>
        </TouchableOpacity>
      </View>
      <AboutAppModal isVisible={aboutVisible} onClose={() => setAboutVisible(false)} />
      <PremiumModal isVisible={premiumVisible} onClose={() => setPremiumVisible(false)} />
      <ContactUsModal isVisible={contactVisible} onClose={() => setContactVisible(false)} />
      <HelpModal isVisible={helpVisible} onClose={() => setHelpVisible(false)} />
    </ScrollView>
  );
}
