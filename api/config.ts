import axios from "axios";

export const createApiClient = (baseURL: string) => {
  return axios.create({
    baseURL,
    headers: {
      "x-client-type": "app",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};