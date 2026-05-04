import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import type { Product } from "../../../shared/product.types";
import { FlatList } from "react-native-gesture-handler";
import useWishlist from "@/hooks/useWishlist";
import NoProductsFound from "./NoProductsFound";

import Ionicons from "@expo/vector-icons/Ionicons";
import useCart from "@/hooks/useCart";

const ProductGrid = ({
  products,
  isLoadingProducts,
  isProductsError,
}: {
  products: Product[];
  isLoadingProducts: boolean;
  isProductsError: boolean;
}) => {
  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
    addingWishlistId,
    removingWishlistId,
  } = useWishlist();

  const { isAddingToCart, addToCart, addingCartId } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart`);
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            `Failed to add ${productName} to cart, ${error?.response?.data?.error || error?.response?.data?.message ||"Unknown error"}`,
          );
        },
      },
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    const isThisProductAddingToWishlist = isAddingToWishlist && addingWishlistId === product._id;
    const isThisProductRemovingFromWishlist = isRemovingFromWishlist && removingWishlistId === product._id;
    const isThisProductWishlistLoading = isThisProductAddingToWishlist || isThisProductRemovingFromWishlist;
    const isThisProductAddingToCart = isAddingToCart && addingCartId === product._id;

    return (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3 justify-between"
        style={{ width: "48%" }}
        activeOpacity={0.8}
        //   onPress={() => router.push(`/product/${product._id}`)}
      >
        <View className="relative">
          <Image
            source={{ uri: product.images[0] }}
            className="w-full h-44 bg-background-lighter"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
            activeOpacity={0.7}
            onPress={() => toggleWishlist(product._id)}
            disabled={isThisProductWishlistLoading}
          >
            {isThisProductWishlistLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons
                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                size={18}
                color={isInWishlist(product._id) ? "#FF6B6B" : "#ffffff"}
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="p-3">
          <Text className="text-text-secondary text-xs mb-1">
            {product.category}
          </Text>
          <Text
            className="text-text-primary font-bold text-sm mb-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color={"#FFC107"} />
          <Text className="text-text-secondary text-xs font-semibold ml-1">
            ({product.averageRating?.toFixed(1) || "N/A"})
          </Text>
          <Text className="text-text-secondary text-xs ml-1">
            {product.totalReviews}
          </Text>
        </View>
        <View className="flex-row items-center justify-between py-2 px-2">
          <Text className="text-primary font-bold text-lg">
            ${product.price?.toFixed(2)}
          </Text>
          <TouchableOpacity
            className="bg-primary size-8 items-center justify-center rounded-full"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id, product.name)}
            disabled={isThisProductAddingToCart}
          >
            {isThisProductAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="add" size={18} color={"#121212"} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoadingProducts) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color={"#00D9FF"} />
        <Text className="text-text-secondary mt-4">Loading products...</Text>
      </View>
    );
  }

  if (isProductsError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color={"#FF6B6B"} />
        <Text className="text-text-primary mt-4 font-semibold text-base">
          Error loading products
        </Text>
        <Text className="text-text-secondary mt-2 text-sm">
          Please try again later
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={renderProduct}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      ListEmptyComponent={NoProductsFound}
    />
  );
};

export default ProductGrid;
