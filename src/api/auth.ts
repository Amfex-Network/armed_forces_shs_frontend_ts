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
  title?: string;
  staffId?: string;
  department?: string;
  teacherRole?: string;
  formClass?: string;
  course?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  mustChangePassword?: boolean;
  formClasses?: string[];
  address?: string;
  notificationPrefs?: Record<string, boolean>;
  memberSince?: string;
}

export interface ProfileUpdate {
  phone?: string;
  address?: string;
  picture?: string;
  title?: string;
  firstname?: string;
  lastname?: string;
  notificationPrefs?: Record<string, boolean>;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user: ApiUser;
}

interface MeResponse {
  success: boolean;
  user: ApiUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/login", { email, password }),

  logout: () => api.post<{ success: boolean }>("/api/auth/logout"),

  me: () => api.get<MeResponse>("/api/auth/me"),

  updateProfile: (payload: ProfileUpdate) =>
    api.put<AuthResponse>(
      "/api/auth/profile",
      payload as Record<string, unknown>,
    ),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<AuthResponse>("/api/auth/change-password", {
      currentPassword,
      newPassword,
    }),
};
