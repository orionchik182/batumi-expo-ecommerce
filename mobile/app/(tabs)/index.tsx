import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useMemo } from "react";
import SafeScreen from "../components/SafeScreen";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import ProductGrid from "../components/ProductGrid";
import useProducts from "@/hooks/useProducts";
import { filterProducts } from "@/utils/filterProducts";
import CategoryFilters from "../components/CategoryFilters";
import type { Product } from "../../../shared/product.types";



const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useProducts();

  const filteredProducts = useMemo(
    () =>
      filterProducts(
        (products as Product[]) ?? [],
        searchQuery,
        selectedCategory,
      ),
    [products, searchQuery, selectedCategory],
  );

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              
              <Text className="text-text-primary text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-secondary mt-1 text-sm">
                Discover our latest products
              </Text>
            </View>
            <TouchableOpacity className="bg-surface/50 p-3 rounded-full">
              <Ionicons name="options-outline" size={28} color={"#fff"} />
            </TouchableOpacity>
          </View>
          {/* Search Bar*/}
          <View className="bg-surface flex-row items-center px-5 py-3 rounded-2xl">
            <Ionicons name="search" size={22} color={"#666"} />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={"#666"}
              className="flex-1 text-text-primary text-base ml-3 focus:outline-none"
              cursorColor={"#fff"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category filters */}
          <CategoryFilters
            selectedCategory={selectedCategory}
            onSelectedCategory={setSelectedCategory}
          />

          <View className="mb-6 mt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-primary text-lg font-bold">
                Products
              </Text>
              <Text className="text-text-secondary text-sm">
                {filteredProducts.length} items
              </Text>
            </View>
            {/* Products grid */}

            {isLoadingProducts ? (
              <ActivityIndicator size="large" color="#000" />
            ) : isProductsError ? (
              <Text>Error loading products</Text>
            ) : (
              <ProductGrid
                products={filteredProducts}
                isLoadingProducts={isLoadingProducts}
                isProductsError={isProductsError}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;
