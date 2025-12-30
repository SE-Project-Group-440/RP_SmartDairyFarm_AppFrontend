import { api } from "../hooks/api";

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const signupRequest = async (payload: any) => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};
