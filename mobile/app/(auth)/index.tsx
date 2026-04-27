import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import useSocialAuth from "@/hooks/useSocialAuth";

const AuthScreen = () => {
  const router = useRouter();
  const { handleSocialAuth, isLoading } = useSocialAuth();
  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      {/* Demo Image */}
      <Image
        source={require("../../assets/images/auth-image.png")}
        className="size-96"
        resizeMode="contain"
      />
      <View className="gap-2 mt-4">
        {/* Google Sign in button */}
        <TouchableOpacity
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          className="border border-gray-300 bg-white rounded-full px-6 py-2 flex-row items-center"
          style={{
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            shadowColor: "#000",
            elevation: 5,
          }}
        >
          <View className="flex-row items-center justify-center gap-2">
            {isLoading ? (
              <ActivityIndicator size={"small"} color="#4285f4" />
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <Image
                  source={require("../../assets/images/google.png")}
                  className="size-10"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">
                  Continue with Google
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        {/* Apple Sign in button */}
        <TouchableOpacity
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          className="border border-gray-300 bg-white rounded-full px-6 py-3 flex-row items-center"
          style={{
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            shadowColor: "#000",
            elevation: 5,
          }}
        >
          <View className="flex-row items-center justify-center gap-2">
            {isLoading ? (
              <ActivityIndicator size={"small"} color="#4285f4" />
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <Image
                  source={require("../../assets/images/apple.png")}
                  className="size-8"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">
                  Continue with Apple
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
        By signing up, you agree to our{" "}
        <Text className="text-blue-500 underline">Terms of Service</Text> and{" "}
        <Text className="text-blue-500 underline">Privacy Policy,{" "}</Text>
        and <Text className="text-blue-500 underline">Cookie Use</Text>
      </Text>
    </View>
  );
};

export default AuthScreen;
