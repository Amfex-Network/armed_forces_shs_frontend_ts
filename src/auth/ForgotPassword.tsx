import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.role) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (verifyCode.join("").length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!passwords.newPass || passwords.newPass !== passwords.confirmPass)
      return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const handleCodeChange = (val, idx) => {
    const next = [...verifyCode];
    next[idx] = val.slice(-1);
    setVerifyCode(next);
    if (val && idx < 5) document.getElementById(`code-${idx + 1}`)?.focus();
  };

  const handleCodeKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !verifyCode[idx] && idx > 0)
      document.getElementById(`code-${idx - 1}`)?.focus();
  };

  const steps = [
    {
      num: 1,
      label: "Enter Credentials",
      sub: "Provide your username and email",
    },
    {
      num: 2,
      label: "Verify Identity",
      sub: "Check your email for verification code",
    },
    { num: 3, label: "Reset Password", sub: "Create a new secure password" },
  ];

  const getStrength = (pass) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const strength = getStrength(passwords.newPass);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][
    strength
  ];

  return (
    <div className="flex min-h-screen font-sans flex-col md:flex-row ">
      {/* LEFT PANEL */}
      <div
        className="md:w-1/2 w-full text-white flex flex-col p-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, var(--royal-blue) 0%, var(--royal-blue-dark) 100%)",
        }}
      >
        {/* decorative circles */}

        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 -top-20 -right-20 animate-float-one"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 -top-20 left-20 animate-float-one"></div>

        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 bottom-16 -left-16 animate-float-two"></div>
        {/* logo */}
        <Link to="/">
          <div className="flex items-center gap-4 mb-20">
            <div className="bg-white p-1 rounded-lg shadow-md">
              <img src={logo} alt="Logo" className=" w-9 h-9" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                ARMED FORCES SHTS
              </h1>
              <p className="text-base md:text-lg  italic">
                Service With Humanlity{" "}
              </p>
            </div>
          </div>
        </Link>

        <h3 className="font-bold mb-5 flex items-center gap-2">
          Recovery Process
        </h3>

        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`flex gap-4 items-center p-4 rounded-lg transition
                ${step === s.num ? "bg-white/15 border-l-4 border-red-400" : "bg-white/5"}
              `}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                ${
                  step > s.num
                    ? "bg-green-500"
                    : step === s.num
                      ? "bg-red-400"
                      : "bg-white/20"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>

              <div>
                <div className="font-semibold text-sm">{s.label}</div>
                <div className="text-xs text-white/60">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto bg-white/10 p-4 rounded-lg flex gap-3">
          <span>🛡️</span>
          <p className="text-sm text-white/80">
            <b className="text-white">Security Tip:</b> Always create strong
            passwords with a mix of letters, numbers and symbols.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-slate-100 flex items-center justify-center p-8  ">
        <div className="bg-white transition-all rounded-2xl px-11 py-10 w-full max-w-[480px] shadow-xl border-2 border-blue-800 ">
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <div className="text-center mb-7 flex flex-col items-center ">
                <h2 className="text-2xl flex items-center gap-2 font-extrabold text-[var(--accent-red)]">
                  <HttpsIcon />
                  Password Recovery
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Follow the steps to reset your password
                </p>
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="flex items-center gap-2 font-bold text-sm text-[var(--royal-blue)] mb-2">
                  Username/ID
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    <PersonIcon />
                  </span>

                  <input
                    type="text"
                    placeholder="Enter your username or ID"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="flex items-center gap-2 font-bold text-sm text-[var(--royal-blue)] mb-2">
                  Registered Email
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    <EmailIcon />
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)]"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-6">
                <label className="flex items-center gap-2 font-bold text-sm text-[var(--royal-blue)] mb-2">
                  Your Role
                </label>

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full py-3 px-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)]"
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2
          ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-[var(--royal-blue)] hover:opacity-90"}`}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <span>→</span> Send Recovery Code
                  </>
                )}
              </button>

              {/* Back to login */}
              <div className="text-center mt-3">
                <a href="#" className="text-sm text-[var(--royal-blue)]">
                  ← Back to Login
                </a>
              </div>

              {/* Support */}
              <div className="border-t mt-6 pt-4 flex items-center gap-3 justify-center text-sm text-gray-600">
                <span className="text-xl">🎧</span>
                <span>
                  <strong>Need help?</strong> Contact IT Support:
                  <a
                    href="mailto:support@excellence.edu.gh"
                    className="text-[var(--royal-blue)] ml-1"
                  >
                    support@excellence.edu.gh
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
