/* eslint-disable @typescript-eslint/no-unused-vars */
import * as SecureStore from "expo-secure-store";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("accessToken", token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("accessToken");
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync("accessToken");
};

export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    console.log("Decoded token:", decoded);
    const exp = decoded.exp;
    console.log("Token expiration time:", exp);
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    console.log("Current time:", now);
    console.log("Is token expired?", now >= exp);
    return now >= exp;
  } catch (err) {
    console.warn("Invalid token");
    return true;
  }
}
