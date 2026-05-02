import { useApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../shared/product.types";

const useProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; products: Product[] }>("/products");
      return data.products;
    },
  });
  return result;
};

export default useProducts;