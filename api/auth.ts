import API from "./client";

export const loginUser = async (email: string, password: string) => {
  const response = await API.post("/carrier/v1/carrier-login", {
    email,
    password,
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  return await API.post("/carrier/v1/forgot-password", { email });
};

export const verifyOtp = async (email: string, otp: string) => {
  return await API.post("/carrier/v1/verify-otp", { email, otp });
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  return await API.post("/carrier/v1/reset-password", {
    email,
    newPassword,
    confirmPassword,
  });
};