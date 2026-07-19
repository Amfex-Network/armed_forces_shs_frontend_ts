// src/layout/TeacherLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
} from "react-icons/fa";

const ROLES = [
  {
    id: "Subject Teacher",
    label: "Subject Teacher",
    icon: FaBook,
    desc: "Enter CA and exam scores, and track student progress",
  },
  {
    id: "Subject Teacher + Form Master",
    label: "Subject Teacher + Form Master",
    icon: FaChalkboardTeacher,
    desc: "Teaches subjects and manages a form class",
  },
  {
    id: "Form Master",
    label: "Form Master",
    icon: FaClipboardList,
    desc: "Supervise teachers, verify scores and record attendance",
  },
];

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [role, setRole] = useState(ROLES[0]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, pw, "teacher", role.id);
    if (res.success) navigate(res.redirectTo || "/teacher", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
      }}
    >
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
            style={{
              background:
                "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,.18)" }}
            >
              <FaShieldAlt size={28} color="#fbbf24" />
            </div>
            <h1 className="text-lg font-black text-white">ARMED FORCES SHTS</h1>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Logging in as:{" "}
              <strong className="text-white">{role.label}</strong>
            </p>
          </div>
          <div className="h-1" style={{ background: "var(--accent-red)" }} />

          {/* Role selector */}
          <div className="px-4 pt-4 space-y-1.5 max-h-56 overflow-y-auto">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = role.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: active ? "var(--royal-blue)" : "#e5e7eb",
                    backgroundColor: active ? "#eef2ff" : "white",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: active ? "var(--royal-blue)" : "#f3f4f6",
                    }}
                  >
                    <Icon size={14} color={active ? "white" : "#6b7280"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold truncate"
                      style={{
                        color: active ? "var(--royal-blue)" : "#111827",
                      }}
                    >
                      {r.label}
                    </p>
                    <p className="text-xs truncate text-gray-400">{r.desc}</p>
                  </div>
                  {active && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--royal-blue)"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="px-6 py-4 space-y-4">
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
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
                    placeholder="yourname@afshts.edu.gh"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
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
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
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
                  style={{ color: "var(--accent-red)" }}
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
                    : "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
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
                  `Sign In as ${role.label} →`
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
