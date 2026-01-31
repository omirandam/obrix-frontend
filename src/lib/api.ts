import axios from "axios";
import { useAuthStore } from "../app/store/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const tokenType = useAuthStore.getState().tokenType ?? "Bearer";

  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }
  return config;
});
