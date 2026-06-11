import { View, Text } from "react-native";
import React from "react";
import type { CartSummary } from "../../../shared/cart.types";

const OrderSummary = ({ subtotal, shipping, tax, total }: CartSummary) => {
  return (
    <View className="px-6 mt-3">
      <View className="bg-surface rounded-3xl p-5">
        <Text className="text-text-primary text-xl font-bold mb-4">
          Summary
        </Text>

        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Subtotal</Text>
            <Text className="text-text-primary font-semibold text-base">
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Shipping</Text>
            <Text className="text-text-primary font-semibold text-base">
              ${shipping.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Tax</Text>
            <Text className="text-text-primary font-semibold text-base">
              ${tax.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-5">
            <Text className="text-text-primary text-lg font-bold">Total</Text>
            <Text className="text-primary font-bold text-2xl">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderSummary;
