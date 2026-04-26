import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const AuthScreen = () => {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Text className="text-4xl font-bold text-white mb-8">
        Welcome to Our Shop
      </Text>
      <View className="flex flex-row gap-2">
        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-full px-6"
          onPress={() => router.push("/")}
        >
          <Text className="text-white font-bold text-xl">Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white p-4 rounded-full px-6"
          onPress={() => router.push("/")}
        >
          <Text className="text-blue-600 font-bold text-xl">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;
