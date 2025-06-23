 // ✅ Direct, no cycles
import { refreshAccessToken } from "@/api/refresh";
import * as SecureStore from "expo-secure-store";
import { isTokenExpired } from "./jwtUtils";


// Save both access and refresh tokens
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
};

// Get access token
export const getAccessToken = async () => {
  return await SecureStore.getItemAsync("accessToken");
};

// Get refresh token
export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken");
};

// Delete tokens
export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

// Token expiry check
// export function isTokenExpired(token: string): boolean {
//   try {
//     const [, payload] = token.split(".");
//     const decoded = JSON.parse(atob(payload));
//     const exp = decoded.exp;
//     if (!exp) return true;
//     const now = Math.floor(Date.now() / 1000);
//     return now >= exp;
//   } catch (err) {
//     console.warn("Invalid token");
//     return true;
//   }
// }

let refreshing = false;
export const isRefreshing = () => refreshing;

export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (!refreshToken || isTokenExpired(refreshToken)) {
    return null;
  }

  try {
    refreshing = true;
    const newToken = await refreshAccessToken();
    return newToken;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return null;
  } finally {
    refreshing = false;
  }
};