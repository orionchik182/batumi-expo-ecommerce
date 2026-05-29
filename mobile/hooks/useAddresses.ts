import { useApi } from "@/lib/api";
import type { Address } from "../../shared/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddresses = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await api.get<{ addresses: Address[] }>(
        "/user/addresses",
      );
      return data.addresses;
    },
  });
  const addAddress = useMutation({
    mutationFn: async (addressData: Omit<Address, "_id">) => {
      const { data } = await api.post<{ addresses: Address[] }>(
        "/user/addresses",
        addressData,
      );
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
  const updateAddress = useMutation({
    mutationFn: async ({addressId, addressData}: {addressId: string, addressData: Partial<Address>}) => {
      const { data } = await api.put<{ addresses: Address[] }>(
        `/user/addresses/${addressId}`,
        addressData,
      );
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
  const removeAddress = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<{ addresses: Address[] }>(`/user/addresses/${id}`);
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
  return {
    addresses: addresses || [],
    isLoading,
    isError,
    addAddress: addAddress.mutate,
    deleteAddress: removeAddress.mutate,
    updateAddress: updateAddress.mutate,
    isAddingAddress: addAddress.isPending,
    isUpdatingAddress: updateAddress.isPending,
    isDeletingAddress: removeAddress.isPending,
  };
};
