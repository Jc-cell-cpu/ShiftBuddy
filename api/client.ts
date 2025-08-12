
import { isTokenExpired } from "@/utils/jwtUtils"; // ✅ updated
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refreshAccessToken } from "./refresh";


// import Constants from "expo-constants";

const API = axios.create({
  // baseURL: "http://10.223.4.72:4000",
  // baseURL: "http://192.168.1.2:4000",
  // baseURL: "http://13.60.225.213:4000",
  baseURL: "https://shift-buddy-carrier-service-main-updated.onrender.com",
  headers: {
    "x-client-type": "app",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Log all requests
API.interceptors.request.use((config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
  console.log("➡️ Request:", config.method?.toUpperCase(),  fullUrl);
  console.log("Headers:", config.headers);
  console.log("Data:", config.data);
  return config;
});

// Log all responses
API.interceptors.response.use(
  (response) => {
    console.log(  '✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log("❌ Error:", error.message);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use(async (config) => {
  let token = await SecureStore.getItemAsync("accessToken");

  if (token && isTokenExpired(token, 300)) {
    token = await refreshAccessToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
