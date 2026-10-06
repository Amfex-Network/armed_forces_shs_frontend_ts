import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "../components/common/ChangePasswordForm";
import logo from "../assets/logo.png";

// Shown after signing in with a temporary password; nothing else in the
// portal is reachable (the API enforces this too) until it is replaced.
const ChangePasswordPage = () => {
  const { user, initializing, logout } = useAuth();
  const navigate = useNavigate();

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
  if (!user) return <Navigate to="/" replace />;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#0b2b4a,#123a63,#1e4e7c)" }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg,#0b2b4a,#123a63)" }}
        >
          <img src={logo} alt="" className="w-12 h-12 mx-auto mb-3" />
          <div className="flex items-center justify-center gap-2 text-white">
            <KeyRound size={18} color="#fbbf24" />
            <h1 className="text-lg font-black">
              {user.mustChangePassword
                ? "Set Your Password"
                : "Change Password"}
            </h1>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,.6)" }}>
            {user.mustChangePassword
              ? "You signed in with a temporary password. Choose your own to continue."
              : user.email}
          </p>
        </div>
        <div className="px-6 py-6">
          <ChangePasswordForm
            submitLabel="Save and Continue"
            onDone={() => navigate(user.homePath || "/", { replace: true })}
          />
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/", { replace: true });
            }}
            className="w-full mt-3 py-2 text-xs font-semibold text-gray-500"
          >
            Sign out instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
