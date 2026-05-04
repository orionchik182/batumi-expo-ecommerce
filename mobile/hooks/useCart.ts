import { useApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Cart } from "../../shared/cart.types";

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await api.post<{ cart: Cart }>(
        `/cart/add`,
        { productId, quantity },
      );
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return {
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    addingCartId: addToCartMutation.variables?.productId,
  }
};

export default useCart;
