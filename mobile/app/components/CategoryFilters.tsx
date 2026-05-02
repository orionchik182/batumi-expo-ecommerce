import { View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { CATEGORIES } from '@/constants/categories';

const CategoryFilters = ({selectedCategory, onSelectedCategory}: {selectedCategory: string, onSelectedCategory: (category: string) => void}) => {
    return (
        <View className="mb-6 mt-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {CATEGORIES.map((category, index) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => onSelectedCategory(category.name)}
                    className={`mr-3 size-20 overflow-hidden justify-center items-center rounded-2xl transition-all ${isSelected ? "bg-primary" : "bg-surface"}`}
                  >
                    {category.icon ? (
                      <Ionicons
                        name={category.icon}
                        size={28}
                        color={isSelected ? "#121212" : "#fff"}
                      />
                    ) : (
                      <Image
                        source={category.image}
                        className="size-12"
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
    )
}


export default CategoryFilters