import { useAuth } from "@clerk/expo";
import axios from "axios";
import { useEffect } from "react";
import { Platform } from "react-native";

let API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Add your API URL to the .env file");
}

if (Platform.OS === "android" && API_URL.includes("localhost")) {
  API_URL = API_URL.replace("localhost", "10.0.2.2");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const {getToken} = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    // cleanup: remove interceptor when component unmounts
    return () => {
      api.interceptors.request.eject(interceptor);
    }
  }, [getToken]);
  return api;
}

// on every single req, we would like to have auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers

export default api;
