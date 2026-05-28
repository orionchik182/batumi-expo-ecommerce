import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
  onBack?: () => void;
}

const Header = ({ title, children, onBack }: HeaderProps) => {
  return (

    <View className="px-6 pb-5 border-b border-surface flex-row items-center">
      <TouchableOpacity onPress={() => { onBack ? onBack() : router.back() }} className="mr-4">
        <Ionicons name={onBack ? "close" : "arrow-back" as any} size={28} color={"#FFFFFF"} />
      </TouchableOpacity>
      <Text className="text-text-primary text-2xl font-bold">
        {title}
      </Text>
      {children}
    </View>
  )
}

export default Header