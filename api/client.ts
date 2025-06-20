import axios from "axios";
// import Constants from "expo-constants";

const API = axios.create({
  baseURL: "http://192.168.10.72:4000",
  // baseURL: "http://localhost:4000",
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
export default API;
