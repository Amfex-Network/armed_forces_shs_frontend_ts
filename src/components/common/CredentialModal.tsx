import React, { useEffect, useState } from "react";
import { Key, Copy, CheckCircle2 } from "lucide-react";
import { usersApi } from "../../api/users";

interface CredentialModalProps {
  name: string;
  tempPassword?: string;
  userId?: string;
  onClose: () => void;
}

const CredentialModal = ({
  name,
  tempPassword,
  userId,
  onClose,
}: CredentialModalProps) => {
  const isNewAccount = !!tempPassword;
  const [copied, setCopied] = useState(false);
  const [pw, setPw] = useState(tempPassword || "");
  const [loading, setLoading] = useState(!tempPassword);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tempPassword || !userId) return;
    let active = true;
    usersApi
      .resetPassword(userId)
      .then((p) => active && setPw(p))
      .catch(
        (e) => active && setError(e?.message || "Failed to reset password"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [tempPassword, userId]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(pw).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div
          className="px-6 py-5 text-center"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Key size={24} className="text-white" />
          </div>
          <p className="text-white font-black text-lg">
            {isNewAccount ? "Account Created" : "Password Reset"}
          </p>
          <p className="text-blue-200 text-xs mt-1">{name}</p>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />
        <div className="p-6 space-y-4">
          <p className="text-sm text-center text-gray-500">
            A temporary password has been generated. Copy it now and share it
            securely - it can't be shown again.
          </p>
          <div
            className="flex items-center gap-2 p-4 rounded-xl border-2"
            style={{
              borderColor: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
            }}
          >
            <p
              className="flex-1 font-mono font-bold text-lg text-center break-all"
              style={{
                color: error ? "var(--accent-red)" : "var(--royal-blue)",
              }}
            >
              {loading ? "Generating…" : error || pw}
            </p>
            {!loading && !error && (
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg transition flex-shrink-0"
                style={{
                  backgroundColor: copied
                    ? "var(--success-dark)"
                    : "var(--royal-blue)",
                  color: "white",
                }}
                title="Copy"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
          <p className="text-xs text-center text-gray-400">
            To issue a new password later, use "Reset password" on this person.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialModal;
