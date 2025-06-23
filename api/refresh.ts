import axios from "axios";
import * as SecureStore from "expo-secure-store";

const refreshClient = axios.create({
  // baseURL: "http://192.168.1.6:4000",
  baseURL: "http://192.168.10.72:4000",
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "app",
  },
});

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await refreshClient.post("/carrier/v1/get-carrier-access-token", {
      refereshToken: refreshToken,
    });

    const newToken = response.data.accessToken;
    if (newToken) {
      await SecureStore.setItemAsync("accessToken", newToken);
      return newToken;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
