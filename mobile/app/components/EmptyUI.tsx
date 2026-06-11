import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

const EmptyUI = () => {
    return (
        <View className='flex-1 bg-background'>
            <View className='px-6 pt-16 pb-5'>
                <Text className='text-text-primary text-3xl font-bold tracking-tight'>Cart</Text>
            </View>
            <View className='flex-1 items-center justify-center px-6'>
                <Ionicons name='cart-outline' size={80} color={"#666"} />
                <Text className='text-text-primary text-xl mt-4 font-semibold'>Your Cart is Empty</Text>
                <Text className='text-text-secondary text-center mt-2'>Add items to your cart to get started</Text>
                <TouchableOpacity className='bg-primary py-3 px-6 rounded-full mt-4' onPress={() => router.push("/")}>
                    <Text className='text-white text-lg font-semibold'>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EmptyUI