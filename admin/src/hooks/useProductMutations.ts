// src/hooks/useProductMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import toast from "react-hot-toast";

export function useProductMutations(onSuccessCallback: () => void) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    onSuccessCallback();
  };

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      toast.success("Product created!");
      invalidate();
    },
    onError: () => toast.error("Create failed"),
    
  });

  const updateMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      toast.success("Product updated!");
      invalidate();
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      toast.success("Product deleted!");
      invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return { createMutation, updateMutation, deleteMutation };
}