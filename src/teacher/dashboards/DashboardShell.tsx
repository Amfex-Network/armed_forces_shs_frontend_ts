// src/teacher/dashboards/DashboardShell.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Edit3,
  BookMarked,
} from "lucide-react";
import { TERM_INFO, CLASSES_DATA, NOTIFICATIONS } from "../data/teacherData";
import { NotifIcon, LoadBar } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

// ─── Welcome banner ───────────────────────────────────────────────────────────
export const WelcomeBanner = ({
  title,
  subtitle,
  accentColor = "var(--royal-blue)",
  children,
}) => {
  const { user } = useAuth();
  const progress = Math.round(
    (TERM_INFO.weeksGone / TERM_INFO.weeksTotal) * 100,
  );
  return (
    <div
      className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accentColor}, var(--royal-blue-dark))`,
      }}
    >
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
        <div className="w-48 h-48 rounded-full bg-white absolute -right-12 -top-12" />
        <div className="w-32 h-32 rounded-full bg-white absolute right-8 bottom-4" />
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-white/60 text-xs mb-0.5">Welcome back,</p>
          <h2 className="text-xl sm:text-2xl font-black">
            {user?.title} {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-white/60 text-xs mt-0.5">
            {user?.subject} · {user?.department} Dept · {user?.staffId}
          </p>
          <div
            className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            {title}
          </div>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div
          className="rounded-xl p-3 text-center min-w-[130px] flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-white/60 text-xs">{TERM_INFO.academicYear}</p>
          <p className="font-bold text-sm">{TERM_INFO.term}</p>
          <p className="text-white/60 text-xs mt-1">
            Wk {TERM_INFO.weeksGone}/{TERM_INFO.weeksTotal}
          </p>
          <div
            className="mt-1.5 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: "#facc15" }}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

// ─── Stat card row
export const StatRow = ({ stats }) => (
  <div
    className={`grid gap-4 grid-cols-2 ${stats.length >= 4 ? "lg:grid-cols-4" : `lg:grid-cols-${stats.length}`}`}
  >
    {stats.map(({ icon: Icon, label, value, sub, color, onClick }) => (
      <div
        key={label}
        onClick={onClick}
        className={`bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-all" : ""}`}
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <p
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            {value}
          </p>
          <p className="text-xs text-gray-500 truncate">{label}</p>
          {sub && (
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--royal-blue)" }}
            >
              {sub}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ─── Section card ─────────────────────────────────────────────────────────────
export const SectionCard = ({
  title,
  icon: Icon,
  accentColor = "var(--royal-blue)",
  linkTo,
  linkLabel = "Full view",
  children,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{
        borderColor: "var(--medium-gray)",
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="font-semibold text-sm flex items-center gap-2"
          style={{ color: "var(--dark-gray)" }}
        >
          {Icon && <Icon size={15} style={{ color: accentColor }} />} {title}
        </h3>
        {linkTo && (
          <button
            onClick={() => navigate(linkTo)}
            className="text-xs flex items-center gap-1"
            style={{ color: accentColor }}
          >
            {linkLabel} <ChevronRight size={12} />
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

// ─── Quick stat grid (used inside section cards) ──────────────────────────────
export const MiniStats = ({ items }) => (
  <div className={`grid gap-3 grid-cols-${Math.min(items.length, 4)}`}>
    {items.map(({ label, value, color }) => (
      <div
        key={label}
        className="text-center p-3 rounded-xl"
        style={{ backgroundColor: "var(--light-gray)" }}
      >
        <p className="text-xl font-black" style={{ color }}>
          {value}
        </p>
        <p className="text-xs text-gray-400 leading-tight mt-0.5">{label}</p>
      </div>
    ))}
  </div>
);

// ─── My Classes quick strip ───────────────────────────────────────────────────
export const MyClassesStrip = () => {
  const navigate = useNavigate();
  return (
    <SectionCard
      title="My Classes"
      icon={BookMarked}
      accentColor="var(--royal-blue)"
      linkTo="/teacher/classes"
      linkLabel="All classes"
    >
      <div className="space-y-2">
        {CLASSES_DATA.map((cls) => (
          <div
            key={cls.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition"
            style={{ border: "1px solid var(--medium-gray)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {cls.name}
                </p>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-semibold"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "var(--royal-blue)",
                  }}
                >
                  {cls.yearGroup || "Form 1"}
                </span>
              </div>
              <p className="text-xs text-gray-400">{cls.students} students</p>
            </div>
            <div className="flex gap-2 text-xs flex-shrink-0">
              <span
                style={{
                  color: cls.caSubmitted
                    ? "var(--success-dark)"
                    : "var(--accent-red)",
                }}
                className="flex items-center gap-0.5"
              >
                {cls.caSubmitted ? (
                  <CheckCircle2 size={11} />
                ) : (
                  <AlertCircle size={11} />
                )}{" "}
                CA
              </span>
              <span
                style={{
                  color: cls.examSubmitted
                    ? "var(--success-dark)"
                    : "var(--warning)",
                }}
                className="flex items-center gap-0.5"
              >
                {cls.examSubmitted ? (
                  <CheckCircle2 size={11} />
                ) : (
                  <AlertCircle size={11} />
                )}{" "}
                Exam
              </span>
            </div>
            <button
              onClick={() => navigate("/teacher/scores")}
              className="p-1.5 rounded-lg flex-shrink-0"
              style={{ color: "var(--royal-blue)" }}
            >
              <Edit3 size={13} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

// ─── Notifications strip ──────────────────────────────────────────────────────
export const NotificationsStrip = () => (
  <SectionCard
    title="Notifications"
    icon={Bell}
    accentColor="var(--accent-red)"
  >
    <div className="space-y-3">
      {NOTIFICATIONS.map((n) => (
        <div key={n.id} className="flex gap-2">
          <NotifIcon type={n.type} />
          <div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--dark-gray)" }}
            >
              {n.message}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  </SectionCard>
);

// ─── Semester schedule strip ────────────────────────────────────────────────
export const TrackSchedule = () => (
  <div
    className="bg-white rounded-xl border shadow-sm p-5"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <h3
      className="font-semibold text-sm flex items-center gap-2 mb-4"
      style={{ color: "var(--dark-gray)" }}
    >
      <RefreshCw size={15} style={{ color: "var(--royal-blue)" }} />
      Transitional System Schedule — {TERM_INFO.academicYear} {TERM_INFO.term}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: "#fefce8", borderColor: "#fde68a" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--warning)" }}
          />
          <span className="font-semibold text-sm" style={{ color: "#78350f" }}>
            Semester 1 — In Session
          </span>
        </div>
        <p className="text-xs" style={{ color: "#92400e" }}>
          {new Date(TERM_INFO.startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          –{" "}
          {new Date(TERM_INFO.endDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-xs font-semibold mt-1" style={{ color: "#78350f" }}>
          Week {TERM_INFO.weeksGone}/{TERM_INFO.weeksTotal}
        </p>
      </div>
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--success)" }}
          />
          <span className="font-semibold text-sm" style={{ color: "#14532d" }}>
            Semester 2 — On Vacation
          </span>
        </div>
        <p className="text-xs" style={{ color: "#166534" }}>
          {TERM_INFO.sem2Schedule}
        </p>
        <p className="text-xs font-semibold mt-1" style={{ color: "#14532d" }}>
          Scores due before Semester 2 begins
        </p>
      </div>
    </div>
  </div>
);

// ─── Quick action button ──────────────────────────────────────────────────────
export const QuickActions = ({ actions }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-xl border shadow-sm p-4"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: "var(--dark-gray)", opacity: 0.5 }}
      >
        Quick Actions
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon, path, color }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-sm active:scale-95 text-center"
            style={{ borderColor: color + "30", backgroundColor: color + "08" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = color + "30")
            }
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: color + "15" }}
            >
              <Icon size={17} style={{ color }} />
            </div>
            <span
              className="text-xs font-semibold leading-tight"
              style={{ color: "var(--dark-gray)" }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
