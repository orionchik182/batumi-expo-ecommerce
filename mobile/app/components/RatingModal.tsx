import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import type { Order } from "../../../shared/order.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";

interface RatingModalProps {
  visible: boolean;
  order: Order | null;
  productRating: { [key: string]: number };
  isSubmitting: boolean;
  onRatingChange: (productId: string, rating: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}
const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  order,
  productRating,
  isSubmitting,
  onRatingChange,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Backdrop Layer */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/70 items-center justify-center px-4">
          <TouchableWithoutFeedback>
            {/* Rating Modal Content */}
            <View className="bg-surface rounded-3xl p-6 w-full max-w-md max-h-[80%]">
              {/* Header */}
              <View className="items-center mb-4">
                <View className="bg-primary/20 rounded-full mb-3 size-16 items-center justify-center">
                  <Ionicons name="star" size={25} color="#1DB954" />
                </View>
                <Text className="text-2xl font-bold text-text-primary mb-1">
                  Rate Your Products
                </Text>
                <Text className="text-sm text-text-secondary text-center">
                  Rate each product from your order to help other customers
                </Text>
              </View>

              {/* Products List */}
              {/* Scrollable Area */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  marginBottom: 40,
                }}
              >
                {/* Product Items */}
                {order?.orderItems.map((item, index) => {
                  const productId = item.product._id;
                  const currentRating = productRating[productId] || 0;

                  return (
                    <View
                      key={item._id}
                      className={`bg-background-lighter rounded-2xl p-4 ${index < order.orderItems.length - 1 ? "mb-3" : ""}`}
                    >
                      <View className="flex-row items-center mb-3">
                        <Image
                          source={item.image}
                          alt={item.name || "Product"}
                          style={{ width: 64, height: 64, borderRadius: 8 }}
                          contentFit="cover"
                        />
                        <View className="flex-1 ml-3">
                          <Text
                            className="text-lg font-semibold text-text-primary"
                            numberOfLines={2}
                          >
                            {item.name}
                          </Text>
                          <Text className="text-base text-text-secondary mt-1">
                            QTY: {item.quantity} • ${item.price.toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      {/* Rating Stars */}

                      <View className="flex-row justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => onRatingChange(productId, star)}
                            activeOpacity={0.7}
                            className="mx-1.5"
                            accessibilityRole="button"
                            accessibilityLabel={`Rate ${item.name} ${star} star${star === 1 ? "" : "s"}`}
                            accessibilityState={{
                              selected: star <= currentRating,
                            }}
                          >
                            <Ionicons
                              name={
                                star <= currentRating ? "star" : "star-outline"
                              }
                              size={32}
                              color={star <= currentRating ? "#1DB954" : "#666"}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              {/* Submit Button */}
              <View className="gap-3">
                <TouchableOpacity
                  className="bg-primary py-4 rounded-2xl items-center"
                  activeOpacity={0.8}
                  onPress={onSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size={"small"} color={"#121212"} />
                  ) : (
                    <Text className="text-background font-bold text-base">
                      Submit All Ratings
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-surface-lighter rounded-2xl py-4 items-center border border-background-lighter"
                  activeOpacity={0.7}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text className="text-text-secondary font-bold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RatingModal;
