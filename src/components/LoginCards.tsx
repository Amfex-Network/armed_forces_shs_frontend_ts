// src/components/LoginCards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRightToLine, ArrowLeft } from "lucide-react";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import SchoolIcon from "@mui/icons-material/School";
import { GiTeacher } from "react-icons/gi";
import { RiParentFill } from "react-icons/ri";
import {
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaChalkboardTeacher,
  FaUsers,
  FaClipboardList,
  FaCheck,
  FaUser,
  FaIdCard,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

// ─── 5 teacher role combinations ─────────────────────────────────────────────
const TEACHER_ROLE_COMBOS = [
  {
    key: "Subject Teacher",
    label: "Subject Teacher",
    icon: FaChalkboardTeacher,
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    border: "#a5b4fc",
    desc: "Enter CA and exam scores, and track student progress",
  },
  {
    key: "Subject Teacher + Form Master",
    label: "Subject Teacher + Form Master",
    icon: FaUsers,
    color: "var(--info)",
    bg: "#eff6ff",
    border: "#93c5fd",
    desc: "Teach your subject and manage your form class",
  },
  {
    key: "Form Master",
    label: "Form Master",
    icon: FaClipboardList,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    desc: "Supervise teachers, verify scores and record attendance",
  },
];

// ─── Other portal roles ───────────────────────────────────────────────────────
const OTHER_ROLES = [
  {
    key: "student",
    label: "Student Login",
    Icon: () => <AccessibilityNewIcon sx={{ fontSize: 40, color: "white" }} />,
    bg: "bg-blue-500",
    hover: "hover:bg-blue-600",
    demo: "kofi@afshts.edu.gh",
    redirect: "/student",
  },
  {
    key: "admin",
    label: "Admin Login",
    Icon: () => <SchoolIcon sx={{ fontSize: 40, color: "white" }} />,
    bg: "bg-red-500",
    hover: "hover:bg-red-600",
    demo: "admin@excellence.edu.gh",
    redirect: "/dashboard",
  },
  {
    key: "parent",
    label: "Parent Login",
    Icon: () => <RiParentFill size={48} color="white" />,
    bg: "bg-purple-600",
    hover: "hover:bg-purple-700",
    demo: "parent@afts.edu.gh",
    redirect: "/parent",
  },
];

// ─── Teacher 2-step modal ─────────────────────────────────────────────────────
const TeacherModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [step, setStep] = useState(1);
  const [chosenCombo, setChosenCombo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [localErr, setLocalErr] = useState("");

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSelect = (combo) => {
    setChosenCombo(combo);
    setStep(2);
  };
  const handleBack = () => {
    setStep(1);
    setChosenCombo(null);
    setLocalErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    if (!email.trim() || !password.trim()) {
      setLocalErr("Please enter both email and password.");
      return;
    }
    const result = await login(email, password, "teacher", chosenCombo.key);
    if (result.success) {
      onClose();
      navigate("/teacher", { replace: true });
    }
  };

  const ComboIcon = chosenCombo?.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#261481" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src={logo}
          alt=""
          draggable={false}
          className="select-none"
          style={{
            width: "400px",
            height: "400px",
            objectFit: "contain",
            opacity: 0.06,
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)",
          transform: "translate(-40%,-40%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230,57,70,0.15) 0%, transparent 65%)",
          transform: "translate(35%,35%)",
        }}
      />
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{
          color: "rgba(255,255,255,0.07)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.25em",
          whiteSpace: "nowrap",
        }}
      >
        ARMED FORCES SHTS · TERMINAL REPORT MANAGEMENT SYSTEM
      </div>

      <div
        className="relative bg-white w-full rounded-2xl shadow-2xl overflow-hidden z-10"
        style={{
          maxWidth: step === 1 ? "580px" : "440px",
          border: "2px solid rgba(255,255,255,0.15)",
          animation: "modalIn 0.28s cubic-bezier(0.16,1,0.3,1) both",
          transition: "max-width 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <img src={logo} alt="AFSHTS" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="font-black text-base leading-tight">
                ARMED FORCES SHTS
              </p>
              <p className="text-blue-200 text-xs">
                {step === 1
                  ? "Teacher Portal — Choose Your Role"
                  : `Logging in as: ${chosenCombo?.label}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-white text-xs px-3 py-1.5 rounded-lg transition"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.15)")
                }
              >
                <ArrowLeft size={12} /> Back
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.15)")
              }
            >
              <FaTimes size={13} />
            </button>
          </div>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />

        {/* Step 1 — Role picker */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center mb-5">
              <p
                className="font-black text-lg"
                style={{ color: "var(--dark-gray)" }}
              >
                What is your role?
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Select the role you were assigned. You cannot change this
                without logging out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEACHER_ROLE_COMBOS.map((combo) => {
                const Icon = combo.icon;
                return (
                  <button
                    key={combo.key}
                    onClick={() => handleSelect(combo)}
                    className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md"
                    style={{
                      backgroundColor: combo.bg,
                      borderColor: combo.border,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = combo.color;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = combo.border;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: combo.color + "20" }}
                    >
                      <Icon size={20} style={{ color: combo.color }} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-black leading-tight"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {combo.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {combo.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Role not listed?{" "}
              <span style={{ color: "var(--royal-blue)", fontWeight: 600 }}>
                Contact the Admin office
              </span>
            </p>
          </div>
        )}

        {/* Step 2 — Login form */}
        {step === 2 && chosenCombo && (
          <div className="px-6 py-5 space-y-4">
            <div
              className="flex items-center gap-3 p-3 rounded-xl border-2"
              style={{
                backgroundColor: chosenCombo.bg,
                borderColor: chosenCombo.border,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: chosenCombo.color + "20" }}
              >
                <ComboIcon size={18} style={{ color: chosenCombo.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-black"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {chosenCombo.label}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {chosenCombo.desc}
                </p>
              </div>
              <FaCheck
                size={14}
                style={{ color: chosenCombo.color }}
                className="flex-shrink-0"
              />
            </div>

            <div
              className="px-3 py-2.5 rounded-lg text-xs"
              style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
            >
              <span className="font-bold">Demo: </span>
              osei@afts.edu.gh /{" "}
              <span className="font-mono font-bold">teacher123</span>
            </div>

            {(localErr || error) && (
              <div
                className="px-3 py-2.5 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: "#fff1f2",
                  color: "var(--accent-red-dark)",
                  border: "1px solid var(--accent-red-light)",
                }}
              >
                {localErr || error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--royal-blue-light)" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="yourname@afts.edu.gh"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 outline-none transition-all"
                    style={{
                      borderColor: "var(--medium-gray)",
                      color: "var(--dark-gray)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--royal-blue)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--medium-gray)")
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--royal-blue-light)" }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border-2 outline-none transition-all"
                    style={{
                      borderColor: "var(--medium-gray)",
                      color: "var(--dark-gray)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--royal-blue)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--medium-gray)")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--royal-blue-light)" }}
                  >
                    {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  style={{ color: "var(--dark-gray)" }}
                >
                  <input
                    type="checkbox"
                    className="accent-[var(--royal-blue)]"
                  />{" "}
                  Remember me
                </label>
                <Link
                  to="/forgotPassword"
                  onClick={onClose}
                  style={{ color: "var(--accent-red)" }}
                  className="font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--royal-blue)" }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.currentTarget.style.backgroundColor =
                      "var(--royal-blue-dark)";
                }}
                onMouseLeave={(e) => {
                  if (!loading)
                    e.currentTarget.style.backgroundColor = "var(--royal-blue)";
                }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In as {chosenCombo.label} <FaArrowRight size={11} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(-18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  );
};

// ─── Simple modal for other portals ──────────────────────────────────────────
const SimpleLoginModal = ({ role, onClose }) => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [localErr, setLocalErr] = useState("");
  const { Icon } = role;
  const isStudent = role.key === "student";

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    if (!email.trim() || !password.trim()) {
      setLocalErr("Please enter your email and password.");
      return;
    }
    if (isStudent && !studentId.trim()) {
      setLocalErr("Please enter your Student ID.");
      return;
    }
    const result = await login(
      email,
      password,
      role.key,
      undefined,
      isStudent ? studentId.trim() : undefined,
    );
    if (result.success) {
      onClose();
      navigate(role.redirect, { replace: true });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#261481" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src={logo}
          alt=""
          draggable={false}
          className="select-none"
          style={{
            width: "400px",
            height: "400px",
            objectFit: "contain",
            opacity: 0.06,
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
        style={{
          border: "2px solid rgba(255,255,255,0.15)",
          animation: "modalIn2 0.28s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div
              className="w-10 h-10 rounded-xl overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <img
                src={logo}
                alt="AFSHTS"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <p className="font-black text-base">ARMED FORCES SHTS</p>
              <p className="text-blue-200 text-xs capitalize">
                {role.key} Portal Login
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.28)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")
            }
          >
            <FaTimes size={13} />
          </button>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />
        <div className="flex justify-center -mt-4 relative z-10 mb-1">
          <div
            className={`${role.bg} w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white`}
          >
            <Icon />
          </div>
        </div>
        <div className="px-6 pb-5 pt-2 space-y-4">
          <p
            className="text-center font-bold text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            {role.label}
          </p>
          <div
            className="px-3 py-2.5 rounded-lg text-xs"
            style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
          >
            {isStudent ? (
              <>
                <span className="font-bold">Demo: </span>kofi@afshts.edu.gh ·
                ID: <span className="font-mono font-bold">AFSHTS/2024/031</span>{" "}
                · pw: <span className="font-mono font-bold">student123</span>
              </>
            ) : (
              <>
                <span className="font-bold">Demo: </span>
                {role.demo} /{" "}
                <span className="font-mono font-bold">{role.key}123</span>
              </>
            )}
          </div>
          {(localErr || error) && (
            <div
              className="px-3 py-2.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: "#fff1f2",
                color: "var(--accent-red-dark)",
                border: "1px solid var(--accent-red-light)",
              }}
            >
              {localErr || error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Student ID — only for student role */}
            {isStudent && (
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Student ID
                </label>
                <div className="relative">
                  <FaUser
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--royal-blue-light)" }}
                  />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    autoFocus
                    placeholder="e.g. AFSHTS/2024/031"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 outline-none transition-all font-mono"
                    style={{
                      borderColor: "var(--medium-gray)",
                      color: "var(--dark-gray)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--royal-blue)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--medium-gray)")
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--dark-gray)" }}
              >
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--royal-blue-light)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus={!isStudent}
                  placeholder={role.demo}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 outline-none transition-all"
                  style={{
                    borderColor: "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--royal-blue)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--medium-gray)")
                  }
                />
              </div>
            </div>
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--dark-gray)" }}
              >
                Password
              </label>
              <div className="relative">
                <FaLock
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--royal-blue-light)" }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border-2 outline-none transition-all"
                  style={{
                    borderColor: "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--royal-blue)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--medium-gray)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--royal-blue-light)" }}
                >
                  {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: "var(--dark-gray)" }}
              >
                <input type="checkbox" className="accent-[var(--royal-blue)]" />{" "}
                Remember me
              </label>
              <Link
                to="/forgotPassword"
                onClick={onClose}
                style={{ color: "var(--accent-red)" }}
                className="font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-60"
              style={{ backgroundColor: "var(--royal-blue)" }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.backgroundColor =
                    "var(--royal-blue-dark)";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.backgroundColor = "var(--royal-blue)";
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FaArrowRight size={11} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes modalIn2{from{opacity:0;transform:translateY(-18px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
};

// ─── LoginCards ───────────────────────────────────────────────────────────────
const LoginCards = () => {
  const [activeModal, setActiveModal] = useState(null);
  return (
    <div className="bg-gray-50 px-4 md:px-8 lg:px-24 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex-1 w-full">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--accent-red-dark)] bg-clip-text text-transparent">
            Streamlined Academic Reporting
          </h1>
          <p className="text-gray-700 text-lg mb-3 max-w-xl">
            Comprehensive terminal report management for schools, teachers,
            students, and parents
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            {[
              { title: "Manage", sub: "5000+ Students" },
              { title: "Real-time", sub: "Analytics" },
              { title: "Secure &", sub: "Reliable" },
            ].map(({ title, sub }) => (
              <div
                key={title}
                className="flex items-start px-6 gap-1 py-4 shadow bg-gray-100 border-[var(--royal-blue)] border-l-4 rounded-xl w-full"
              >
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {title}
                  </h3>
                  <p className="text-gray-800">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <div className="bg-white rounded-3xl border-2 border-blue-700 shadow-lg p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightToLine className="text-[var(--royal-blue)]" />
                <h2 className="text-2xl font-bold text-[var(--royal-blue)]">
                  Portal Login
                </h2>
              </div>
              <p className="text-gray-600">Select your role to sign in</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setActiveModal("teacher")}
                className="bg-green-500 hover:bg-green-600 cursor-pointer text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-md"
              >
                <GiTeacher size={48} />
                <span className="font-semibold text-lg">Teacher Login</span>
              </button>
              {OTHER_ROLES.map((role) => {
                const { Icon } = role;
                return (
                  <button
                    key={role.key}
                    onClick={() => setActiveModal(role)}
                    className={`${role.bg} ${role.hover} cursor-pointer text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-md`}
                  >
                    <Icon />
                    <span className="font-semibold text-lg">{role.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Link
                to="/forgotPassword"
                className="text-[var(--accent-red)] font-medium text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {activeModal === "teacher" && (
        <TeacherModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal && activeModal !== "teacher" && (
        <SimpleLoginModal
          role={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default LoginCards;
