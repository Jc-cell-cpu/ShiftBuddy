import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string, bufferInSeconds = 0): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const nowInSeconds = Date.now() / 1000;
    return nowInSeconds >= (exp - bufferInSeconds);
  } catch {
    return true;
  }
};
