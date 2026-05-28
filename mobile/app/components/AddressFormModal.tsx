import { View, Text, Modal, ScrollView, TextInput, TouchableOpacity, Switch, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import type { AddressFormModalProps } from '../../../shared/user.types'
import SafeScreen from './SafeScreen'
import Header from './Header'


const AddressFormModal = ({
    visible,
    isEditing,
    addressData,
    isAddingAddress,
    isUpdatingAddress,
    onClose,
    onSubmit,
    onFormChange,
}: AddressFormModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className='flex-1'>
                <SafeScreen>
                    <Header title={`${isEditing ? "Edit" : "Add New"} Address`} onBack={onClose} />
                    <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                        <View className='p-6'>
                            {/* Label Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>Label</Text>
                                <TextInput
                                    value={addressData.label}
                                    onChangeText={(text) => onFormChange({ ...addressData, label: text })}
                                    placeholder="e.g., Home, Work, Office"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* Full Name Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>Full Name</Text>
                                <TextInput
                                    value={addressData.fullName}
                                    onChangeText={(text) => onFormChange({ ...addressData, fullName: text })}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* Phone Number Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>Phone Number</Text>
                                <TextInput
                                    value={addressData.phoneNumber}
                                    onChangeText={(text) => onFormChange({ ...addressData, phoneNumber: text })}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* Street Address Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>Street Address</Text>
                                <TextInput
                                    value={addressData.streetAddress}
                                    onChangeText={(text) => onFormChange({ ...addressData, streetAddress: text })}
                                    placeholder="Enter your street address"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* City Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>City</Text>
                                <TextInput
                                    value={addressData.city}
                                    onChangeText={(text) => onFormChange({ ...addressData, city: text })}
                                    placeholder="Enter your city"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* State Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>State</Text>
                                <TextInput
                                    value={addressData.state}
                                    onChangeText={(text) => onFormChange({ ...addressData, state: text })}
                                    placeholder="Enter your state"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* Zip Code Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>Zip Code</Text>
                                <TextInput
                                    value={addressData.zipCode}
                                    onChangeText={(text) => onFormChange({ ...addressData, zipCode: text })}
                                    placeholder="Enter your zip code"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* Country Input */}
                            <View className='mb-5'>
                                <Text className='text-text-primary font-semibold mb-2'>Country</Text>
                                <TextInput
                                    value={addressData.country}
                                    onChangeText={(text) => onFormChange({ ...addressData, country: text })}
                                    placeholder="Enter your country"
                                    placeholderTextColor="#666"
                                    className="bg-surface p-4 rounded-2xl text-text-primary text-base"
                                />
                            </View>
                            {/* Is Default Checkbox */}
                            <View className='bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6'>

                                <Text className='text-text-primary font-semibold'>Set as default address</Text>
                                <Switch
                                    value={addressData.isDefault}
                                    onValueChange={(value) => onFormChange({ ...addressData, isDefault: value })}

                                    thumbColor="white"
                                />
                            </View>
                            {/* Save Button */}
                            <TouchableOpacity
                                onPress={onSubmit}
                                disabled={isAddingAddress || isUpdatingAddress}
                                className="bg-primary py-5 rounded-2xl items-center"
                                activeOpacity={0.8}
                            >
                                {isAddingAddress || isUpdatingAddress ? (<ActivityIndicator color="#121212" size="small" />) : (<Text className="text-background font-bold text-base text-center">{isEditing ? "Save Changes" : "Add Address"}</Text>)}

                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </SafeScreen>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddressFormModal