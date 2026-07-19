// src/teacher/components/TeacherUI.jsx
import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export const Avatar = ({ name, size = "md", color = "bg-blue-900" }) => {
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name[0];
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-14 h-14 text-lg",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 uppercase`}
    >
      {initials}
    </div>
  );
};

export const LoadBar = ({ pct, showLabel = true }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500"}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
    {showLabel && (
      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
    )}
  </div>
);

export const RolePill = ({ role }) => {
  const map = {
    HOD: "bg-purple-100 text-purple-700",
    "Form Teacher": "bg-blue-100 text-blue-700",
    "WAEC Supervisor": "bg-red-100 text-red-700",
    "Subject Teacher": "bg-gray-100 text-gray-600",
    "Assistant HOD": "bg-indigo-100 text-indigo-700",
    "Exam Coordinator": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[role] || "bg-gray-100 text-gray-600"}`}
    >
      {role}
    </span>
  );
};

export const YearGroupBadge = ({ yearGroup }) => {
  const styles = {
    "Form 1": "bg-blue-100 text-blue-800",
    "Form 2": "bg-purple-100 text-purple-800",
    "Form 3": "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[yearGroup] || "bg-gray-100 text-gray-700"}`}
    >
      {yearGroup || "All Year Groups"}
    </span>
  );
};

export const NotifIcon = ({ type }) => {
  if (type === "warning")
    return (
      <AlertCircle size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" />
    );
  if (type === "success")
    return (
      <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
    );
  return <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />;
};

export const StatCard = ({ icon: Icon, label, value, sub, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-all" : ""}`}
  >
    <div
      className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}
    >
      <Icon size={20} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 truncate">{label}</p>
      {sub && <p className="text-xs text-blue-600 font-medium">{sub}</p>}
    </div>
  </div>
);

export const PageHeader = ({ title, breadcrumb }) => (
  <div className="mb-6">
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
    <p className="text-sm text-gray-400 mt-0.5">
      Home / Teacher /{" "}
      <span className="text-blue-700 font-medium">{breadcrumb || title}</span>
    </p>
  </div>
);
