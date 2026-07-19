// src/layout/ParentLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUsers, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function ParentLogin() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [localErr, setLocalErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    if (!email.trim() || !pw.trim()) {
      setLocalErr("Please enter both email and password.");
      return;
    }
    const res = await login(email, pw, "parent");
    if (res.success) navigate(res.redirectTo || "/parent", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#4c1d95,#5b21b6,#6d28d9)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src={logo}
          alt=""
          style={{
            width: 420,
            height: 420,
            objectFit: "contain",
            opacity: 0.05,
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Close */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Header */}
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{ background: "linear-gradient(135deg,#4c1d95,#5b21b6)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,.15)" }}
            >
              <FaUsers size={28} color="#fbbf24" />
            </div>
            <h1 className="text-lg font-black text-white">ARMED FORCES SHTS</h1>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Parent / Guardian Portal
            </p>
          </div>
          <div className="h-1" style={{ background: "#7c3aed" }} />

          <div className="px-6 py-6 space-y-4">
            {(localErr || error) && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {localErr || error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="parent@email.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type={showPw ? "text" : "password"}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold"
                  style={{ color: "#7c3aed" }}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg,#4c1d95,#5b21b6)",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>{" "}
                    Signing In…
                  </>
                ) : (
                  "Sign In as Parent →"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 pb-4">
            AFSHTS Terminal Report System
          </p>
        </div>
      </div>
    </div>
  );
}
