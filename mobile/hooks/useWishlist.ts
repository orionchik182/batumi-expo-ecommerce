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
      const { data } = await api.get<{ message: string; wishlist: any[] }>(
        "/user/wishlist",
      );
      return data.wishlist;
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.some((item: any) => {
      if (typeof item === 'string') return item === productId;
      return item?._id === productId;
    });
  };

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post<{ wishlist: string[] }>(
        `/user/wishlist`,
        { productId }
      );
      return data.wishlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ wishlist: string[] }>(
        `/user/wishlist/${productId}`,
      );
      return data.wishlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const toggleWishlist = (productId: string) => {
    if (isLoading || isError) return;
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
    isInWishlist,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    addingWishlistId: addToWishlistMutation.variables,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    removingWishlistId: removeFromWishlistMutation.variables,
    toggleWishlist,
  };
};

export default useWishlist;
