import { useApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Cart } from "../../shared/cart.types";

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<Cart>(`/cart`);
      return data;
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await api.post<Cart>(
        `/cart/add`,
        { productId, quantity },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateCartQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const { data } = await api.put<{ cart: Cart }>(
        `/cart/${productId}`,
        { quantity },
      );
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart`);
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const cartTotal = cart?.items.reduce((total, item) => total + item.quantity * item.product.price, 0) ?? 0;

  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return {
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateCartQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutateAsync,
    isAddingToCart: addToCartMutation.isPending,
    addingCartId: addToCartMutation.variables?.productId,
    isUpdating: updateCartQuantityMutation.isPending,
    updatingCartId: updateCartQuantityMutation.variables?.productId,
    updatingCartQuantity: updateCartQuantityMutation.variables?.quantity,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    error,
  }
};

export default useCart;
