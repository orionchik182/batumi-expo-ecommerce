import { useApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateReviewData } from "../../shared/user.types";
import { Alert } from "react-native";

export const useReviews = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const response = await api.post("/reviews", data);
      return response.data;
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to create review");
    },
  });
  return {
    isCreatingReview: createReview.isPending,
    createReviewAsync: createReview.mutateAsync,
  };
};
