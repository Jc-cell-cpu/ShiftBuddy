import * as SecureStore from "expo-secure-store";

export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("userName"); // optional if you're storing name
};
