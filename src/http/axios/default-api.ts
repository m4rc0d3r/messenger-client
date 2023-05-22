import axios from "axios";

import { HTTP_SERVER_URL } from "@/env";
import { pinia } from "@/stores/pinia";
import { useAuthStore } from "@/stores/auth-store";

export const defaultAPI = axios.create({
  baseURL: HTTP_SERVER_URL,
});

defaultAPI.interceptors.request.use((config) => {
  if (config.headers !== undefined) {
    config.headers.authorization = `Bearer ${useAuthStore(pinia).token.value}`;
  }

  return config;
});
