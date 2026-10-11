// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authApi,
  type ApiUser,
  type ProfileUpdate,
  type Role,
} from "../api/auth";
import { ApiError, AUTH_EVENTS, sessionEpoch } from "../api/client";
import { normalizeTeacherRole } from "../utils/teacherRoles";

export const CHANGE_PASSWORD_PATH = "/changePassword";

export const PASSWORD_RULES =
  "At least 10 characters, with an uppercase letter, a lowercase letter and a number.";

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
    picture: u.picture || "",
    address: u.address || "",
    notificationPrefs: u.notificationPrefs || {},
    memberSince: u.memberSince || "",
    title: u.title || "",
    staffId: u.staffId || "",
    department: u.department || "",
    teacherRole: u.teacherRole || "",
    formClass: u.formClass || "",
    formClasses:
      u.formClasses && u.formClasses.length
        ? u.formClasses
        : u.role === "teacher" && u.formClass
          ? [u.formClass]
          : [],
    course: u.course || "",
    assignedClasses: u.assignedClasses || [],
    assignedSubjects: u.assignedSubjects || [],
    mustChangePassword: !!u.mustChangePassword,
    homePath: REDIRECT[u.role] || "/dashboard",
    redirectTo: u.mustChangePassword
      ? CHANGE_PASSWORD_PATH
      : REDIRECT[u.role] || "/dashboard",
    // The account's own student ID wins over whatever was typed at sign-in.
    ...(u.role === "student"
      ? { studentId: (u as { studentId?: string }).studentId || studentId }
      : {}),
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
  // True after a deliberate sign-out, so protected pages send the person to
  // the entry page rather than to a login form.
  const [signedOut, setSignedOut] = useState(false);
  // The role comes from the account (set by the admin), never from a choice
  // made at sign-in.
  const activeRole =
    user?.role === "teacher"
      ? normalizeTeacherRole(user.teacherRole as string)
      : "";

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // A flaky connection or a busy server must not log the user out:
      // only a real 401/403 means the session is gone.
      for (let attempt = 0; attempt < 4 && !cancelled; attempt++) {
        try {
          const res = await authApi.me();
          if (!cancelled && res?.success && res.user) {
            setUser(normalize(res.user));
          }
          break;
        } catch (err) {
          const status = err instanceof ApiError ? err.status : 0;
          if (status === 401 || status === 403 || status === 404) break;
          if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          }
        }
      }
      if (!cancelled) setInitializing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Another request found the session gone (expired, revoked, or the
  // account was deactivated): drop the user so routes send them to sign in.
  useEffect(() => {
    // Ignore answers to requests sent before the latest sign-in/sign-out: a
    // slow request started while signed out must not sign the new session
    // out again.
    const onExpired = (e: Event) => {
      const epoch = (e as CustomEvent<{ epoch: number }>).detail?.epoch;
      if (epoch !== undefined && epoch !== sessionEpoch.current) return;
      setUser(null);
    };
    const onMustChange = () =>
      setUser((u) =>
        u
          ? { ...u, mustChangePassword: true, redirectTo: CHANGE_PASSWORD_PATH }
          : u,
      );
    window.addEventListener(AUTH_EVENTS.expired, onExpired);
    window.addEventListener(AUTH_EVENTS.passwordChange, onMustChange);
    return () => {
      window.removeEventListener(AUTH_EVENTS.expired, onExpired);
      window.removeEventListener(AUTH_EVENTS.passwordChange, onMustChange);
    };
  }, []);

  const updateProfile = async (payload: ProfileUpdate) => {
    const res = await authApi.updateProfile(payload);
    const normalized = normalize(res.user);
    setUser(normalized);
    return normalized;
  };

  const changePassword = async (current: string, next: string) => {
    const res = await authApi.changePassword(current, next);
    const normalized = normalize(res.user);
    setUser(normalized);
    return normalized;
  };

  const login = async (
    email: string,
    password: string,
    _role = "",
    _unused = "",
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
      sessionEpoch.current += 1;
      setSignedOut(false);
      setUser(normalized);
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
    sessionEpoch.current += 1;
    setSignedOut(true);
    setUser(null);
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
        signedOut,
        initializing,
        loading,
        error,
        login,
        logout,
        changePassword,
        updateProfile,
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
