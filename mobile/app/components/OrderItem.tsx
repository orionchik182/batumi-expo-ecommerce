import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import type { Order } from "../../../shared/order.types";
import { Image } from "expo-image";
import { capitalizeFirstLetter, formatDate, getStatusColor } from "@/lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";

const OrderItem = ({
  order,
  onRatePress,
}: {
  order: Order;
  onRatePress: () => void;
}) => {
  const totalItems = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const firstImage = order.orderItems[0]?.image || "";

  return (
    <View className="bg-surface rounded-3xl p-5 mb-4">
      <View className="mb-4 flex-row">
        <View className="relative">
          <Image
            source={firstImage}
            alt={order.orderItems[0].name}
            style={{ height: 80, width: 80, borderRadius: 8 }}
            contentFit="cover"
          />
          {/* Badge For More Items */}
          {order.orderItems.length > 1 && (
            <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center">
              <Text className="text-background text-xs font-bold">
                +{order.orderItems.length - 1}
              </Text>
            </View>
          )}
        </View>

        <View>
          <View className="flex-1 ml-4">
            <Text className="text-text-primary font-bold text-base mb-1">
              Order #{order._id.slice(-8).toUpperCase()}
            </Text>
            <Text className="text-text-secondary text-sm mb-2">
              {formatDate(order.createdAt)}
            </Text>
            <View
              className="self-start px-3 py-1.5 rounded-full"
              style={{ backgroundColor: getStatusColor(order.status) + "20" }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: getStatusColor(order.status) }}
              >
                {capitalizeFirstLetter(order.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Order Items Summary */}
      {order.orderItems.map((item) => (
        <Text
          key={item._id}
          className="text-text-secondary text-sm flex-1"
          numberOfLines={1}
        >
          {item.name} x {item.quantity}
        </Text>
      ))}
      <View className="border-t border-background-lighter pt-3 flex-row justify-between items-center">
        <View>
          <Text className="text-text-secondary text-xs mb-1">
            {totalItems} items
          </Text>
          <Text className="text-primary font-bold text-xl">
            ${order.totalPrice.toFixed(2)}
          </Text>
        </View>
        {order.status === "delivered" &&
          (order.hasReviewed ? (
            <View className="bg-primary/20 px-5 py-3 rounded-full flex-row items-center">
              <Ionicons name="checkmark-circle" size={18} color={"#1DB954"} />
              <Text className="text-primary font-bold text-sm ml-2">
                Reviewed
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-primary px-5 py-3 rounded-full flex-row items-center"
              onPress={onRatePress}
              activeOpacity={0.7}
            >
              <Ionicons name="star" size={18} color={"#121212"} />
              <Text className="text-background font-bold text-sm ml-2">
                Leave Rating
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default OrderItem;
