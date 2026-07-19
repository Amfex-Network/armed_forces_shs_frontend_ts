import { api } from "./client";

export type Role = "admin" | "teacher" | "student" | "parent";

export interface ApiUser {
  _id?: string;
  id?: string;
  firstname: string;
  lastname: string;
  othernames?: string;
  email: string;
  phone?: string;
  role: Role;
  picture?: string;
  active?: boolean;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: ApiUser;
}

interface MeResponse {
  success: boolean;
  user: ApiUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/login", { email, password }),

  register: (payload: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role?: Role;
    phone?: string;
  }) => api.post<AuthResponse>("/api/auth/register", payload),

  logout: () => api.post<{ success: boolean }>("/api/auth/logout"),

  me: () => api.get<MeResponse>("/api/auth/me"),
};
