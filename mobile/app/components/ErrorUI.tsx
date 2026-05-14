import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';


const ErrorUI = ({error, title}:{error: any, title: string}) => {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Error</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color={"#FF6B6B"} />
        <Text className="text-text-primary text-xl mt-4 font-semibold">Failed to load {title}</Text>
        <Text className="text-text-secondary text-center mt-2">
          {error?.message}
        </Text>
      </View>
    </SafeScreen>
  )
}

export default ErrorUI