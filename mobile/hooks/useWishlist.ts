import { useApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const useWishlist = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; wishlist: string[] }>(
        "/users/wishlist",
      );
      return data.wishlist;
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.includes(productId);
  };

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post<{ message: string; wishlist: string }>(
        `/users/wishlist/${productId}`,
      );
      return data.wishlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ message: string; wishlist: string }>(
        `/users/wishlist/${productId}`,
      );
      return data.wishlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlist: wishlist || [],
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    addToWishlist: addToWishlistMutation.mutate,
    isInWishlist: isInWishlist,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    toggleWishlist: toggleWishlist,
  };
};

export default useWishlist;
