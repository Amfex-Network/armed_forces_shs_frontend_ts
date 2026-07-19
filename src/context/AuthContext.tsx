// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, type ApiUser, type Role } from "../api/auth";
import { ApiError } from "../api/client";

// Redirect map per role
const REDIRECT: Record<Role, string> = {
  admin: "/dashboard",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

export interface AppUser {
  id?: string;
  role: Role;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  picture?: string;
  redirectTo: string;
  studentId?: string;
  [key: string]: unknown;
}

function normalize(u: ApiUser, studentId = ""): AppUser {
  const firstName = u.firstname || "";
  const lastName = u.lastname || "";
  const name =
    `${firstName} ${lastName}`.trim() || (u.email ? u.email.split("@")[0] : "");
  return {
    id: u._id || u.id,
    role: u.role,
    name,
    firstName,
    lastName,
    email: u.email,
    phone: u.phone,
    picture: u.picture,
    redirectTo: REDIRECT[u.role] || "/dashboard",
    ...(u.role === "student" && studentId ? { studentId } : {}),
  };
}

const AuthContext = createContext<unknown>(null);

export const useAuth = (): any => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [activeRole, setActiveRole] = useState<string>(() => {
    try {
      return sessionStorage.getItem("afts_active_role") || "Subject Teacher";
    } catch {
      return "Subject Teacher";
    }
  });

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.me();
        if (!cancelled && res?.success && res.user) {
          setUser(normalize(res.user));
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setTeacherRole = (role: Role, chosenTeacherRole: string) => {
    const locked =
      role === "teacher"
        ? chosenTeacherRole || "Subject Teacher"
        : "Subject Teacher";
    setActiveRole(locked);
    try {
      sessionStorage.setItem("afts_active_role", locked);
    } catch {
      /* ignore */
    }
  };

  const login = async (
    email: string,
    password: string,
    _role = "",
    chosenTeacherRole = "",
    studentId = "",
  ) => {
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      setLoading(false);
      return { success: false };
    }

    try {
      const res = await authApi.login(email.trim().toLowerCase(), password);
      const normalized = normalize(res.user, studentId.trim());
      setUser(normalized);
      setTeacherRole(normalized.role, chosenTeacherRole);
      setLoading(false);
      return { success: true, redirectTo: normalized.redirectTo };
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
      return { success: false };
    }
  };

  const logout = async () => {
    setUser(null);
    setActiveRole("Subject Teacher");
    try {
      sessionStorage.removeItem("afts_active_role");
    } catch {
      /* ignore */
    }
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        initializing,
        loading,
        error,
        login,
        logout,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        isTeacher: user?.role === "teacher",
        isStudent: user?.role === "student",
        isParent: user?.role === "parent",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
