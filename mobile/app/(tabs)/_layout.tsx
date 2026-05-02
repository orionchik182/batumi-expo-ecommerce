import React, { useState, useEffect } from "react";
import { Redirect, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@clerk/expo";
import { ActivityIndicator, StyleSheet, Platform, View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";
import { GlassView } from 'expo-glass-effect';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

type CustomTabBarProps = BottomTabBarProps & { insets: EdgeInsets };

function CustomTabBar({ state, descriptors, navigation, insets }: CustomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const paddingHorizontal = 8;
  const tabWidth = (tabBarWidth - paddingHorizontal * 2) / state.routes.length;
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      translateX.value = withSpring(state.index * tabWidth, {
        mass: 1,
        damping: 20,
        stiffness: 150,
      });
    }
  }, [state.index, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: 64 + (Platform.OS === "ios" ? insets.bottom / 2 : 10),
          marginBottom: Platform.OS === "ios" ? insets.bottom : 20,
          paddingBottom: Platform.OS === "ios" ? insets.bottom / 2 : 10,
        },
      ]}
    >
      {Platform.OS === "ios" ? (
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
          colorScheme="dark"
          glassEffectStyle="clear"
          tintColor="transparent"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(18, 18, 18, 0.85)", borderRadius: 32 },
          ]}
        />
      )}

      <View
        style={styles.pillTrack}
        onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
      >
        {tabBarWidth > 0 && (
          <Animated.View
            style={[styles.activePill, { width: tabWidth }, animatedStyle]}
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? "#1DB954" : "#B3B3B3";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({ color, size: 22, focused: isFocused })}
              <Text
                style={{
                  color,
                  fontSize: 10,
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                {options.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const TabsLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} insets={insets} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    marginHorizontal: 60,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 32,
    overflow: "hidden",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
  },
  pillTrack: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
    paddingHorizontal: 8,
  },
  activePill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
    left: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TabsLayout;
