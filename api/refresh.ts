/* eslint-disable @typescript-eslint/no-unused-vars */

import { deleteTokens } from "@/utils/authUtils";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const refreshClient = axios.create({
  // baseURL: "http://10.223.4.72:4000",
  // baseURL: "http://13.60.225.213:4000",
  // baseURL: "https://13.62.45.50",
  baseURL: "https://shift-buddy-carrier-service-main-updated.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "app",
  },
});

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) {
    await deleteTokens();
    router.replace("/auth/login");
    return null;
  }

  try {
    const response = await refreshClient.post("/carrier/v1/get-carrier-access-token", {
      refereshToken: refreshToken,
    });

    const newToken = response.data.accessToken;
    if (newToken) {
      await SecureStore.setItemAsync("accessToken", newToken);
      return newToken;
    } else {
      throw new Error("No accessToken in response");
    }
  } catch (error) {
    // console.error("Error refreshing token:", error);
    await deleteTokens();
    router.replace("/auth/login");
    return null;
  }
};
