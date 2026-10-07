// src/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, CHANGE_PASSWORD_PATH } from "../context/AuthContext";

// Maps each role to its login page
const LOGIN_PAGES: Record<string, string> = {
  admin: "/adminLogin",
  teacher: "/teacherLogin",
  student: "/studentLogin",
  parent: "/parentLogin",
};

/**
 * Usage:
 *   <ProtectedRoute allowedRole="admin">
 *     <DashboardLayout />
 *   </ProtectedRoute>
 */
const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: string;
}) => {
  const { user, isLoggedIn, initializing, signedOut } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-4 border-gray-200 animate-spin"
          style={{ borderTopColor: "#4c1d95" }}
        />
      </div>
    );
  }

  // Not logged in at all → go to the relevant login page
  if (!isLoggedIn && signedOut) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to={LOGIN_PAGES[allowedRole] || "/adminLogin"}
        state={{ from: location }} // so login can redirect back after success
        replace
      />
    );
  }

  // A temporary password must be replaced before anything else.
  if (user.mustChangePassword) {
    return <Navigate to={CHANGE_PASSWORD_PATH} replace />;
  }

  // Logged in but wrong role → redirect to their own portal
  if (user.role !== allowedRole) {
    return <Navigate to={user.redirectTo} replace />;
  }

  // Correct role → render the page
  return children;
};

export default ProtectedRoute;
