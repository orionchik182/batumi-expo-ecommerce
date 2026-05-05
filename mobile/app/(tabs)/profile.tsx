import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import React from "react";
import SafeScreen from "@/app/components/SafeScreen";
import { useAuth, useUser } from "@clerk/expo";
import { MENU_ITEMS } from "@/constants/menuItems";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const router = useRouter();
  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if (action === "/profile") return;
    // router.push(action);
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Header */}

        <View className="px-6 pb-8">
          <View className="bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                  }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                  <Ionicons name="checkmark" size={16} color="#121212" />
                </View>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {user?.emailAddresses[0]?.emailAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Menu Items*/}
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuPress(item.action)}
              className="bg-surface rounded-2xl p-6 items-center justify-between"
              style={{ width: "48%" }}
              activeOpacity={0.7}
            >
              <View
                className="items-center justify-center mb-4 size-16 rounded-full"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text className="text-text-primary text-base font-bold">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications btn*/}
        <View className="mx-6 mb-3 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            // onPress={() => handleMenuPress("/notifications")}
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="items-center flex-row">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#FFFFFF"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Privacy and security link */}
        <View className="mx-6 mb-3 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            // onPress={() => handleMenuPress("/privacy-security")}
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="items-center flex-row">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#FFFFFF"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Privacy & Security
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Sign Out button */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
          activeOpacity={0.7}
        >
          <View className="items-center flex-row">
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="text-red-500 font-bold ml-2 text-base">
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
