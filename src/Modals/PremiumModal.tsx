import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import tw from "twrnc";

const PremiumModal = ({ isVisible, onClose }) => {
  const premiumPlans = [
    {
      id: "1",
      price: "₹100/month",
      users: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      id: "2",
      price: "₹200/month",
      users: ["Feature A", "Feature B", "Feature C", "Feature D"],
    },
    {
      id: "3",
      price: "₹300/month",
      users: ["Feature X", "Feature Y", "Feature Z", "Feature W"],
    },
  ];

  const renderCard = ({ item }) => (
    <View
      style={[
        tw`bg-white rounded-lg shadow-lg p-6`,
        { width: Dimensions.get("screen").width * 0.8, marginHorizontal: 10 },
      ]}
    >
      <Text style={tw`text-xl font-bold text-center mb-4`}>{item.price}</Text>
      <Text style={tw`text-lg font-semibold text-gray-700 mb-2`}>
        Included Features:
      </Text>
      {item.users.map((user, index) => (
        <Text key={index} style={tw`text-sm text-gray-600`}>
          - {user}
        </Text>
      ))}
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={[tw`bg-white p-4 rounded-lg`, { width: "95%" }]}>
          <Text style={tw`text-lg font-bold text-center mb-4`}>
            Premium Features
          </Text>
          <FlatList
            data={premiumPlans}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            style={tw`bg-blue-600 py-2 rounded-lg mt-5`}
            onPress={onClose}
          >
            <Text style={tw`text-center text-white font-bold`}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};



export default PremiumModal;
