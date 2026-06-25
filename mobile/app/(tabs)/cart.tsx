import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import SafeScreen from "@/app/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { useAddresses } from "@/hooks/useAddresses";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import type { Address } from "../../../shared/user.types";
import LoadingUI from "../components/LoadingUI";
import ErrorUI from "../components/ErrorUI";
import EmptyUI from "../components/EmptyUI";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import OrderSummary from "../components/OrderSummary";
import AddressSelectionModal from "../components/AddressSelectionModal";
import * as Sentry from "@sentry/react-native";

const CartScreen = () => {
  const api = useApi();
  const {
    addToCart,
    isAddingToCart,
    cart,
    isLoading,
    isError,
    error,
    isClearing,
    cartItemCount,
    cartTotal,
    clearCart,
    isRemoving,
    isUpdating,
    updatingCartId,
    updatingCartQuantity,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { addresses } = useAddresses();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0; // $10 shipping fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${productName} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(productId),
        },
      ],
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // check if user has addresses
    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add an address to your account before checking out",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add Address",
            style: "default",
            onPress: () => router.push("/addresses"),
          },
        ],
      );
      return;
    }

    // show address selection modal
    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    setAddressModalVisible(false);

    // log checkout initiated
    Sentry.logger.info("Checkout initiated", {
      itemCount: cartItemCount,
      total: total.toFixed(2),
      city: selectedAddress.city,
      state: selectedAddress.state,
      country: selectedAddress.country,
    });
    try {
      setPaymentLoading(true);

      // create payment intent with cart items and shipping address
      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        cartId: cart?._id,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          phoneNumber: selectedAddress.phoneNumber,
        },
        paymentMethodType: "card",
      });
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Expo-ecommerce",
        style: "alwaysDark",
        appearance: {
          colors: {
            primary: "#1DB954",
            background: "#121212",
            componentBackground: "#282828",
            componentBorder: "#3E3E3E",
            componentDivider: "#3E3E3E",
            primaryText: "#FFFFFF",
            secondaryText: "#B3B3B3",
            componentText: "#FFFFFF",
            icon: "#FFFFFF",
            placeholderText: "#6A6A6A",
          },
          shapes: {
            borderRadius: 24,
          },
        },
      });
      if (initError) {
        Sentry.logger.error("Payment sheet init failed", {
          errorCode: initError.code,
          errorMessage: initError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });
        Alert.alert("Error", initError.message);
        return;
      }
      // present payment sheet
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Sentry.logger.error("Payment cancelled", {
          errorCode: presentError.code,
          errorMessage: presentError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });
        Alert.alert("Payment cancelled", presentError.message);
        return;
      } else {
        Sentry.logger.info("Payment successful", {
          total: total.toFixed(2),
          itemCount: cartItems.length,
        });
        Alert.alert("Payment successful", "Your order is being processed");
        clearCart();
      }
    } catch (error: any) {
      Sentry.logger.error("Payment placement failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        cartTotal: total,
        itemCount: cartItems.length,
      });
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to place order";
      Alert.alert("Error", errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingUI title="cart" />;

  if (isError) return <ErrorUI error={error} title="Failed to load cart" />;

  if (cartItems.length === 0)
    return (
      <EmptyUI
        title="Cart"
        description="Your cart is empty"
        actionTitle="Start Shopping"
      />
    );

  return (
    <SafeScreen>
      <Text className="text-text-primary px-6 pb-5 text-3xl font-bold tracking-tight">
        Cart
      </Text>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View>
          {cartItems.map((item) => {
            const isThisItemUpdating =
              isUpdating && updatingCartId === item.product._id;
            const isDecreaseUpdating =
              isThisItemUpdating && (updatingCartQuantity ?? 0) < item.quantity;
            const isIncreaseUpdating =
              isThisItemUpdating && (updatingCartQuantity ?? 0) > item.quantity;

            return (
              <View
                className="bg-surface rounded-3xl overflow-hidden mb-3 mx-6"
                key={item._id}
              >
                <View className="p-4 flex-row">
                  {/* product Image */}
                  <View className="relative">
                    <Image
                      source={item.product.images[0]}
                      className="bg-background-lighter"
                      contentFit="cover"
                      style={{ width: 112, height: 112, borderRadius: 16 }}
                    />
                    <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                      <Text className="text-background text-xs font-bold">
                        {item.quantity}
                      </Text>
                    </View>
                  </View>
                  {/* product details */}
                  <View className="flex-1 ml-4 justify-between">
                    <View>
                      <Text
                        className="text-text-primary font-bold text-lg leading-tight"
                        numberOfLines={2}
                      >
                        {item.product.name}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="text-primary font-bold text-2xl">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Text>
                        <Text className="text-text-secondary text-sm ml-2">
                          ${item.product.price.toFixed(2)} each
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center mt-3">
                      <TouchableOpacity
                        className="bg-background-lighter rounded-full size-9 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity,
                            -1,
                          )
                        }
                        disabled={isUpdating}
                      >
                        {isDecreaseUpdating ? (
                          <ActivityIndicator size={"small"} color={"#FFFFFF"} />
                        ) : (
                          <Ionicons name="remove" size={18} color={"#FFFFFF"} />
                        )}
                      </TouchableOpacity>
                      <View className="mx-4 min-w-[32px] items-center">
                        <Text className="text-text-primary font-bold text-lg">
                          {item.quantity}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="bg-background-lighter rounded-full size-9 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity,
                            1,
                          )
                        }
                        disabled={isUpdating}
                      >
                        {isIncreaseUpdating ? (
                          <ActivityIndicator size={"small"} color={"#FFFFFF"} />
                        ) : (
                          <Ionicons name="add" size={18} color={"#FFFFFF"} />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="ml-auto bg-red-500/10 rounded-full size-9 items-center justify-center"
                        activeOpacity={0.7}
                        disabled={isRemoving}
                        onPress={() =>
                          handleRemoveItem(item.product._id, item.product.name)
                        }
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={"#EF4444"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl border-t border-surface pt-4 pb-32 px-6">
        {/* Quick Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color={"#1DB954"} />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-text-primary font-bold text-xl">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
        {/* Checkout Button */}
        <TouchableOpacity
          className="bg-primary rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading || cartItems.length === 0}
        >
          <View className="py-5 flex-row items-center justify-center">
            {paymentLoading ? (
              <ActivityIndicator size={"small"} color={"#121212"} />
            ) : (
              <>
                <Text className="text-background font-bold text-lg mr-2">
                  Checkout
                </Text>
                <Ionicons name="arrow-forward" size={20} color={"#121212"} />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

export default CartScreen;
