import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth, PASSWORD_RULES } from "../../context/AuthContext";

// Mirrors the server policy so most mistakes are caught before submitting;
// the server remains the authority.
export const clientPasswordProblem = (pw: string, email = "") => {
  if (pw.length < 10) return "Use at least 10 characters.";
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) {
    return "Use an uppercase letter, a lowercase letter and a number.";
  }
  const local = email.split("@")[0].toLowerCase();
  if (local.length >= 4 && pw.toLowerCase().includes(local)) {
    return "Do not include your email name.";
  }
  return "";
};

const PwInput = ({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--dark-gray)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          maxLength={128}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border-2 outline-none"
          style={{ borderColor: "var(--medium-gray)" }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

const ChangePasswordForm = ({
  onDone,
  submitLabel = "Change Password",
}: {
  onDone?: () => void;
  submitLabel?: string;
}) => {
  const { user, changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDone(false);
    if (!current) return setError("Enter your current password.");
    const problem = clientPasswordProblem(next, user?.email);
    if (problem) return setError(problem);
    if (next !== confirm) return setError("The new passwords do not match.");
    if (next === current) {
      return setError("The new password must be different.");
    }
    try {
      setBusy(true);
      setError("");
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
      onDone?.();
    } catch (err: any) {
      setError(err?.message || "Could not change the password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#fff1f2", color: "var(--accent-red)" }}
        >
          <AlertCircle size={13} /> {error}
        </div>
      )}
      {done && (
        <div
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#f0fdf4", color: "var(--success-dark)" }}
        >
          <CheckCircle2 size={13} /> Password changed. Other devices have been
          signed out.
        </div>
      )}
      <PwInput
        label="Current Password"
        value={current}
        onChange={setCurrent}
        autoComplete="current-password"
      />
      <PwInput
        label="New Password"
        value={next}
        onChange={setNext}
        autoComplete="new-password"
      />
      <PwInput
        label="Confirm New Password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
      />
      <p className="text-xs text-gray-400">{PASSWORD_RULES}</p>
      <button
        type="submit"
        disabled={busy}
        className="w-full py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-60"
        style={{ backgroundColor: "var(--royal-blue)" }}
      >
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
