import { isTokenExpired } from "@/utils/jwtUtils";
import { AddSlotTrackRequest, AddSlotTrackResponse } from "@/utils/slotTrack"; // Adjust path
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refreshAccessToken } from "./refresh";

const API = axios.create({
  baseURL: "https://shift-buddy-carrier-service-main-updated.onrender.com",
  headers: {
    "x-client-type": "app",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Existing interceptors (unchanged)
API.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
  console.log("➡️ Request:", config.method?.toUpperCase(), fullUrl);
  console.log("Headers:", config.headers);
  console.log("Data:", config.data);
  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
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

// Existing functions (unchanged)
export async function uploadDocument(fileUri: string, fileName: string, mimeType: string) {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    } as any);

    const response = await API.post("/doc/v1/upload_doc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // { msg, documentId }
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

export async function getSlotDetails(id: string) {
  try {
    const response = await API.get(`/slot/v1/get_slot_details/${id}`);
    return response.data; // { msg, data }
  } catch (error) {
    console.error("Error fetching slot details:", error);
    throw error;
  }
}

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
      ...params,
    });

    return response.data; // { msg, count, data, currentPage, totalPages }
  } catch (error) {
    console.error("Error fetching carrier slots:", error);
    throw error;
  }
}

export async function getTrackMaster() {
  try {
    const response = await API.get("/master/v1/get_track_master");
    return response.data; // { msg, data }
  } catch (error) {
    console.error("Error fetching track master:", error);
    throw error;
  }
}

export async function addSlotTrack(params: AddSlotTrackRequest): Promise<AddSlotTrackResponse> {
  try {
    const response = await API.post("/slot/v1/add_slot_track", params);
    return response.data; // { msg, data }
  } catch (error) {
    console.error("Error adding slot track:", error);
    throw error;
  }
}

export async function getSlotTrack(slotId: string) {
  try {
    const response = await API.get(`/slot/v1/get_slot_track/${slotId}`);
    return response.data; // { msg, data }
  } catch (error) {
    console.error("Error fetching slot track:", error);
    throw error;
  }
}

export default API;