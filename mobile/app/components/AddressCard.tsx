import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import type { Address } from '../../../shared/user.types'
import Ionicons from '@expo/vector-icons/Ionicons';

interface AddressCardProps {
    address: Address;
    onDelete: (addressId: string) => void;
    onEdit: (address: Address) => void;
    isDeletingAddress: boolean;
    isUpdatingAddress: boolean;
}

const AddressCard = ({ address, onDelete, onEdit, isDeletingAddress, isUpdatingAddress }: AddressCardProps) => {
    return (
        <View className='bg-surface p-5 mb-3 rounded-3xl'>
            <View className='flex-row items-center justify-between mb-4'>
                <View className='flex-row items-center'>
                    <View className='bg-primary/20 rounded-full size-12 items-center justify-center mr-3'>
                        <Ionicons
                            name="location"
                            size={24}
                            color={"#1D8954"}
                        />
                    </View>
                    <Text className='text-text-primary font-bold text-lg'>{address.label}</Text>
                </View>
                {address.isDefault && (
                    <View className='bg-primary px-3 py-1 rounded-full'>
                        <Text className='text-background font-bold text-xs'>Default</Text>
                    </View>
                )}
            </View>
            <View className='ml-15'>
                <Text className='text-text-primary font-semibold mb-1'>{address.fullName}</Text>
                <Text className='text-text-secondary text-sm mb-1'>{address.streetAddress}</Text>
                <Text className='text-text-secondary text-sm mb-2'>{address.city}, {address.state} {address.zipCode}</Text>
                <Text className='text-text-secondary text-sm mb-2'>{address.phoneNumber}</Text>
                <Text className='text-text-secondary text-sm'>{address.country}</Text>
            </View>
            <View className='flex-row gap-2 mt-4'>
                <TouchableOpacity className='flex-1 items-center bg-primary/20 py-3 rounded-xl' onPress={() => onEdit(address)} disabled={isUpdatingAddress} activeOpacity={0.7} >
                    <Text className='text-primary font-semibold'>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-1 items-center bg-red-500/20 py-3 rounded-xl' onPress={() => onDelete(address._id)} disabled={isDeletingAddress} activeOpacity={0.7}>
                    <Text className='text-red-500 font-bold'>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddressCard