// src/layout/LogoutPage.jsx
// Shared signed-out page for Student, Teacher and Parent portals
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogIn,
  Clock,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from "lucide-react";

const ROLE_CONFIG = {
  student: {
    label: "Student Portal",
    color: "#7c3aed",
    colorDark: "#5b21b6",
    bg: "#f5f3ff",
    loginPath: "/studentLogin",
    loginLabel: "Student Login",
    initials: "ST",
  },
  teacher: {
    label: "Teacher Portal",
    color: "var(--royal-blue)",
    colorDark: "var(--royal-blue-dark)",
    bg: "#eef2ff",
    loginPath: "/teacherLogin",
    loginLabel: "Teacher Login",
    initials: "TC",
  },
  parent: {
    label: "Parent Portal",
    color: "#b45309",
    colorDark: "#92400e",
    bg: "#fefce8",
    loginPath: "/parentLogin",
    loginLabel: "Parent Login",
    initials: "PR",
  },
};

const OTHER_PORTALS = {
  student: [
    { label: "Teacher", path: "/teacherLogin", color: "var(--royal-blue)" },
    { label: "Parent", path: "/parentLogin", color: "#b45309" },
    { label: "Admin", path: "/adminLogin", color: "var(--accent-red)" },
  ],
  teacher: [
    { label: "Student", path: "/studentLogin", color: "#7c3aed" },
    { label: "Parent", path: "/parentLogin", color: "#b45309" },
    { label: "Admin", path: "/adminLogin", color: "var(--accent-red)" },
  ],
  parent: [
    { label: "Student", path: "/studentLogin", color: "#7c3aed" },
    { label: "Teacher", path: "/teacherLogin", color: "var(--royal-blue)" },
    { label: "Admin", path: "/adminLogin", color: "var(--accent-red)" },
  ],
};

const LogoutPage = ({ role = "student" }) => {
  const navigate = useNavigate();
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const [seconds, setSeconds] = useState(10);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          navigate("/", { replace: true });
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [navigate, rc.loginPath]);

  useEffect(() => {
    const c = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(c);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-GH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  const formatDate = (d) =>
    d.toLocaleDateString("en-GH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const checks = [
    "Your session has been securely terminated",
    "All temporary data has been cleared",
    "Authentication tokens have been invalidated",
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        background: `linear-gradient(135deg, var(--royal-blue-dark) 0%, var(--royal-blue) 60%, ${rc.color} 100%)`,
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative w-full max-w-md space-y-4">
        {/* School badge */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white font-black text-xl shadow-2xl"
            style={{ backgroundColor: rc.color }}
          >
            AF
          </div>
          <p className="text-white font-black text-base tracking-wide">
            ARMED FORCES SHTS
          </p>
          <p className="text-blue-200 text-xs mt-0.5">{rc.label} · Kumasi</p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success header */}
          <div
            className="px-6 py-6 text-center"
            style={{
              background: `linear-gradient(135deg, var(--success-dark), #15803d)`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-white font-black text-xl">
              Signed Out Successfully
            </h1>
            <p className="text-green-200 text-xs mt-1">
              Your {rc.label.toLowerCase()} session has ended
            </p>
          </div>
          <div className="h-1" style={{ backgroundColor: rc.color }} />

          <div className="p-6 space-y-4">
            {/* Timestamp */}
            <div
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock size={13} style={{ color: rc.color }} />
                <p className="text-xs font-bold" style={{ color: rc.color }}>
                  Session Ended
                </p>
              </div>
              <p
                className="text-2xl font-black font-mono"
                style={{ color: "var(--dark-gray)" }}
              >
                {formatTime(time)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(time)}</p>
            </div>

            {/* Security checks */}
            <div className="space-y-2">
              {checks.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ backgroundColor: "#f0fdf4" }}
                >
                  <CheckCircle2
                    size={13}
                    style={{ color: "var(--success-dark)", flexShrink: 0 }}
                  />
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--success-dark)" }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Shared device warning */}
            <div
              className="flex gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
            >
              <AlertTriangle
                size={14}
                style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }}
              />
              <p className="text-xs" style={{ color: "#92400e" }}>
                If you're on a shared device, close this browser tab to prevent
                unauthorised access.
              </p>
            </div>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                Redirecting to login in{" "}
                <strong style={{ color: rc.color }}>{seconds}</strong> second
                {seconds !== 1 ? "s" : ""}…
              </p>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--medium-gray)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(seconds / 10) * 100}%`,
                    backgroundColor: rc.color,
                  }}
                />
              </div>
            </div>

            {/* Sign in again */}
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-white transition-all shadow-md"
              style={{ backgroundColor: rc.color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = rc.colorDark)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = rc.color)
              }
            >
              <LogIn size={16} /> {rc.loginLabel}
            </button>

            {/* Other portals */}
            <div
              className="pt-2 border-t"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <p className="text-xs text-center text-gray-400 mb-2">
                Access another portal
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(OTHER_PORTALS[role] || OTHER_PORTALS.student).map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => navigate(p.path)}
                    className="py-2 text-xs font-semibold rounded-xl border-2 transition"
                    style={{
                      borderColor: p.color,
                      color: p.color,
                      backgroundColor: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = p.color;
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = p.color;
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-blue-200 text-xs">
          <Lock size={11} />
          <span>AFSHTS Terminal Report System · Secure Session</span>
        </div>
      </div>

      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default LogoutPage;
