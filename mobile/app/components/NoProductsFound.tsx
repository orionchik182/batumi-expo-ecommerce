import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";

const NoProductsFound = () => {
  return (
    <View className="items-center justify-center py-20">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="text-text-primary mt-4 font-semibold">No products found</Text>
      <Text className="text-text-secondary mt-2 text-sm">Try adjusting your search or filters</Text>
    </View>
  );
};

export default NoProductsFound;