import API from "./client";

export const loginUser = async (email: string, password: string) => {
  const response = await API.post("/carrier/v1/carrier-login", {
    email,
    password,
  });
  return response.data;
};
