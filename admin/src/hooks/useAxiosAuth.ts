import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";

export const useAxiosAuth = () => {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return; // ❗ ВАЖНО

    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken, isLoaded]);
};