import axios from "axios";

import { useConfigStore } from "@/config";
import { useAuthStore } from "@/stores/auth-store";
import { pinia } from "@/stores/pinia";

export const defaultAPI = axios.create({
  baseURL: useConfigStore(pinia).config.serverApp.httpUrl,
});

defaultAPI.interceptors.request.use((config) => {
  if (config.headers !== undefined) {
    config.headers.authorization = `Bearer ${useAuthStore(pinia).token.value}`;
  }

  return config;
});
