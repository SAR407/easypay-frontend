import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/Authentication/login", credentials);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/Authentication/register", data);
  return response.data;
};
