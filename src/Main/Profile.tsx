import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  
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
import { GradientText } from "../Variants/TextCva";
import { Button } from "../Variants/ButtonExample";
import { Alert,AlertDescription,AlertHeader } from "../Variants/AlertCva";

export default function Profile() {
  const [showAlert,setShowAlert]=useState(false)
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

  const dismissAlert = () => {
    setShowAlert(false); // Hide the alert
    navigation.navigate("Login"); // Navigate to Login after dismissing the alert
  };

  const handleLogout = () => {
    setShowAlert(true); // Show the custom alert
  };

  return (
    <View>
      
    <ScrollView>
    
      <View style={tw`flex-1 p-5 bg-gray-100`}>
      <GradientText
        fontSize={24}
        fontWeight="bold"
        colors={["#ff7e5f", "#feb47b"]}
        align="center"
        width={300}
      >
        Profile
      </GradientText>
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

        <Button
  label="Save Profile"
  intent="primary"
  size="medium"
  gradientColors={["#38a169", "#2f855a"]} // Matching the green color gradient
  onPress={saveUserData}
   className="mt-2 text-white font-bold"
/>


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

        <Button
  label="Logout"
  intent="primary"
  size="medium"
  gradientColors={["#f56565", "#c53030"]} // Red gradient background
  onPress={handleLogout}
  className="mt-2 text-white font-bold" // Adds margin-top and ensures bold, white text
/>


      </View>
      <AboutAppModal isVisible={aboutVisible} onClose={() => setAboutVisible(false)} />
      <PremiumModal isVisible={premiumVisible} onClose={() => setPremiumVisible(false)} />
      <ContactUsModal isVisible={contactVisible} onClose={() => setContactVisible(false)} />
      <HelpModal isVisible={helpVisible} onClose={() => setHelpVisible(false)} />
    </ScrollView>
    </View>
  );
}
