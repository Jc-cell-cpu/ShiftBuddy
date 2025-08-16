
import { isTokenExpired } from "@/utils/jwtUtils"; // ✅ updated
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refreshAccessToken } from "./refresh";


// import Constants from "expo-constants";

const API = axios.create({
  // baseURL: "http://10.223.4.72:4000",
  // baseURL: "http://192.168.1.2:4000",
  // baseURL: "https://13.62.45.50",
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


export async function getCarrierSlots(params: {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
  slotView?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  try {
    const response = await API.post("/slot/v1/get_carrier_slot", {
      page: 1,
      limit: 20,
      slotView: "list",
      sortBy: "createdAt",
      sortOrder: "desc",
      ...params, // this will override defaults with whatever you pass in
    });

    return response.data; // { msg, count, data, currentPage, totalPages }
  } catch (error) {
    console.error("Error fetching carrier slots:", error);
    throw error;
  }
}


export default API;
