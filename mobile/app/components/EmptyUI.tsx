import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const EmptyUI = ({
  title,
  description,
  actionTitle,
  actionPath,
}: {
  title: string;
  description: string;
  actionTitle: string;
  actionPath?: string;
}) => {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">
          {title}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color={"#666"} />
        <Text className="text-text-primary text-xl mt-4 font-semibold">
          {description}
        </Text>
        <TouchableOpacity
          className="bg-primary py-3 px-6 rounded-full mt-4"
          onPress={() => router.push((actionPath as any) || "/")}
        >
          <Text className="text-white text-lg font-semibold">
            {actionTitle}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyUI;
