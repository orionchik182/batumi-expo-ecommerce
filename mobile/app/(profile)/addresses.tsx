import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";


import { useAddresses } from "@/hooks/useAddresses";
import { useState } from "react";
import type { Address } from "../../../shared/user.types";
import LoadingUI from "../components/LoadingUI";
import ErrorUI from "../components/ErrorUI";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";
import SafeScreen from "../components/SafeScreen";
import AddressFormModal from "../components/AddressFormModal";
import AddressCard from "../components/AddressCard";

const AddressScreen = () => {
  const {
    addresses,
    isLoading,
    isError,
    addAddress,
    deleteAddress,
    updateAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddresses();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, "_id">>({
    label: "",
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });
  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
  };
  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
  };
  const handleDeleteAddress = (addressId: string) => {

    deleteAddress(addressId);
  };
  const handleSaveAddress = () => {
    if (!addressForm.label || !addressForm.fullName || !addressForm.phoneNumber || !addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.zipCode || !addressForm.country) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (editingAddressId) {
      updateAddress({ addressId: editingAddressId, addressData: addressForm }, {
        onSuccess: () => {
          setShowAddressForm(false);
          setEditingAddressId(null);
          setAddressForm({
            label: "",
            fullName: "",
            phoneNumber: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            isDefault: false,
          });
          Alert.alert("Success", "Address updated successfully");
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      });
    } else {
      addAddress(addressForm, {
        onSuccess: () => {
          setShowAddressForm(false);
          setEditingAddressId(null);
          setAddressForm({
            label: "",
            fullName: "",
            phoneNumber: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            isDefault: false,
          });
          Alert.alert("Success", "Address added successfully");
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      });
    }
  };
  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
  };

  if (isLoading) return <LoadingUI title="My Addresses" />;

  if (isError)
    return <ErrorUI title="My Addresses" error="Failed to fetch addresses" />;

  return (
    <SafeScreen>
      <Header title="My Addresses" />
      {addresses.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="location-outline" size={80} color={"#666"} />
          <Text className="text-text-primary font-semibold text-xl mt-4">
            You don't have any addresses
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add your first delivery address
          </Text>
          <TouchableOpacity
            onPress={handleAddAddress}
            activeOpacity={0.8}
            className="bg-primary px-8 py-4 rounded-2xl mt-6"
          >
            <Text className="text-background font-bold text-base">Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-6 py-4">
            {addresses.map((address) => (
              <AddressCard key={address._id} address={address} onDelete={handleDeleteAddress} onEdit={handleEditAddress} isDeletingAddress={isDeletingAddress} isUpdatingAddress={isUpdatingAddress} />
            ))}
            <TouchableOpacity
              onPress={handleAddAddress}
              className="bg-primary rounded-2xl py-4 items-center mt-2" activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="add-circle-outline" size={24} color={"#121212"} />
                <Text className="text-background font-bold text-base ml-2">Add New Address</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressData={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={handleCloseAddressForm}
        onSubmit={handleSaveAddress}
        onFormChange={(data) => setAddressForm(prev => ({ ...prev, ...data }))}
      />
    </SafeScreen>
  );
};

export default AddressScreen;
