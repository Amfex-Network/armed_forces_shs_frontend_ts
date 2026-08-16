import React from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  MessageSquare,
  FileText,
  CalendarCheck,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

const TOOLS = [
  { to: "/teacher/scores", label: "Score Entry", icon: ClipboardList },
  { to: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/teacher/comments", label: "Comments", icon: MessageSquare },
  { to: "/teacher/reports", label: "Report Cards", icon: FileText },
];

const ScopedPanel = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const { user } = useAuth();
  const { settings } = useSettings();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#eef2ff" }}
        >
          <ShieldCheck size={18} style={{ color: "var(--royal-blue)" }} />
        </div>
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
            {title}
          </h1>
          <p className="text-xs text-gray-400">
            {settings.currentAcademicYear} · {settings.currentTerm}
          </p>
        </div>
      </div>

      {/* Real context */}
      <div
        className="bg-white rounded-xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <p
          className="text-xs font-black uppercase tracking-wider mb-3"
          style={{ color: "var(--dark-gray)" }}
        >
          Your Assignment
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { l: "Name", v: `${user?.title || ""} ${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—" },
            { l: "Role", v: (user as any)?.teacherRole || "Teacher" },
            { l: "Department", v: (user as any)?.department || "—" },
            { l: "Form Class", v: user?.formClass || "—" },
          ].map(({ l, v }) => (
            <div key={l}>
              <p className="text-xs text-gray-400 uppercase">{l}</p>
              <p className="font-semibold" style={{ color: "var(--dark-gray)" }}>
                {v}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Honest note */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
      >
        <Info size={16} style={{ color: "var(--royal-blue)" }} className="flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: "#1e40af" }}>
          {description ||
            "Role-specific analytics for this panel are being finalised. In the meantime, use the tools below — all your marking, attendance, comments and reports run on live data."}
        </p>
      </div>

      {/* Real tools */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOOLS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-xl border p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#eef2ff" }}
            >
              <Icon size={18} style={{ color: "var(--royal-blue)" }} />
            </div>
            <p className="text-xs font-semibold text-center" style={{ color: "var(--dark-gray)" }}>
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScopedPanel;
