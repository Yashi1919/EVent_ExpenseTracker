import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import tw from "twrnc";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ContactUsModal = ({ isVisible, onClose }) => {
  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[tw`bg-white p-6 rounded-lg`, { width: "90%" }]}>
          <Text style={tw`text-lg font-bold text-center mb-4`}>Contact Us</Text>

          {/* Contact Details */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-800 mb-2 text-center`}>
              For any queries, feel free to reach out:
            </Text>
            <TouchableOpacity
              style={tw`flex-row items-center justify-center mb-2`}
              onPress={() => handleOpenLink("pendyalayasvanth@app.com")}
            >
              <MaterialIcons name="email" size={20} color="#6c63ff" />
              <Text style={tw`text-gray-700 ml-2`}>pendyalayasvanth@app.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center justify-center mb-2`}
              onPress={() => handleOpenLink("tel:+91 7993521142")}
            >
              <MaterialIcons name="phone" size={20} color="#6c63ff" />
              <Text style={tw`text-gray-700 ml-2`}>+91 7993521142</Text>
            </TouchableOpacity>
          </View>

          {/* Social Media Links */}
          <View style={tw`flex-row justify-center mb-4`}>
            <TouchableOpacity
              style={tw`mx-3`}
              onPress={() => handleOpenLink("https://instagram.com")}
            >
              <FontAwesome name="instagram" size={28} color="#E1306C" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`mx-3`}
              onPress={() => handleOpenLink("https://facebook.com")}
            >
              <FontAwesome name="facebook" size={28} color="#1877F2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`mx-3`}
              onPress={() => handleOpenLink("https://twitter.com")}
            >
              <FontAwesome name="twitter" size={28} color="#1DA1F2" />
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={tw`bg-blue-600 py-2 rounded-lg`}
            onPress={onClose}
          >
            <Text style={tw`text-center text-white font-bold`}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ContactUsModal;
