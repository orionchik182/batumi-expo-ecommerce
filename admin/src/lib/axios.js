import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // by adding this field, we allow the browser to send cookies with requests
});

export default axiosInstance;
