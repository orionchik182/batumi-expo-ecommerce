import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import type {
  Address,
  AddressSelectionModalProps,
} from "../../../shared/user.types";
import { useAddresses } from "@/hooks/useAddresses";
import Ionicons from "@expo/vector-icons/Ionicons";

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const {
    addresses,
    isLoading: addressesLoading,
    isError: addressesError,
  } = useAddresses();

  const hasAddresses = addresses && addresses.length > 0;

  useEffect(() => {
    if (visible && hasAddresses) {
      // Pre-select default address or first address
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
    if (!visible) {
      setSelectedAddress(null);
    }
  }, [visible, hasAddresses]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background rounded-t-3xl h-1/2">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-surface">
            <Text className="text-text-primary text-2xl font-bold">
              Select Address
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-surface rounded-full p-2"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Addresses List */}
          <ScrollView
            className="flex-1 p-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Loading State */}
            {addressesLoading && (
              <View className="flex-1 items-center justify-center py-8">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}

            {/* Error State */}
            {addressesError && !addressesLoading && (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-text-primary">
                  Failed to load addresses
                </Text>
              </View>
            )}

            {/* Empty State */}
            {!addressesLoading &&
              !addressesError &&
              (!addresses || addresses.length === 0) && (
                <View className="flex-1 items-center justify-center py-8">
                  <Text className="text-text-primary">No addresses found</Text>
                </View>
              )}
            {/* View of the address */}
            {!addressesLoading &&
              !addressesError &&
              addresses &&
              addresses.length > 0 && (
                <View className="gap-4">
                  {addresses.map((address: Address) => (
                    <TouchableOpacity
                      key={address._id}
                      className={`bg-surface rounded-3xl p-6 border-2 ${selectedAddress?._id === address._id ? "border-primary" : "border-background-lighter"}`}
                      onPress={() => setSelectedAddress(address)}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center mb-3">
                            <Text className="text-primary font-bold text-lg mr-2">
                              {address.label}
                            </Text>
                            {address.isDefault && (
                              <View className="bg-primary/20 px-3 py-1 rounded-full">
                                <Text className="text-primary text-sm font-semibold">
                                  Default
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-text-primary font-semibold text-lg mb-2">
                            {address.fullName}
                          </Text>
                          <Text className="text-text-secondary text-base mb-2">
                            {address.city}, {address.state}, {address.country}
                          </Text>
                          <Text className="text-text-secondary text-base">
                            {address.phoneNumber}
                          </Text>
                        </View>

                        {selectedAddress?._id === address._id && (
                          <View className="bg-primary rounded-full p-2 ml-3">
                            <Ionicons
                              name="checkmark"
                              size={24}
                              color="#121212"
                            />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </ScrollView>
          <View className="p-6 border-t border-surface">
            <TouchableOpacity
              className="bg-primary rounded-2xl py-5"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) {
                  onProceed(selectedAddress);
                }
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size={"small"} color="#121212" />
                ) : (
                  <>
                    <Text className="text-background font-bold text-lg mr-2">
                      Continue to Payment
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#121212" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;
