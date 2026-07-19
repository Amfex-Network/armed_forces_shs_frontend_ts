// src/admin/dashboard/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  TrendingUp,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Activity,
  Award,
  Bell,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

// ─── Mock school-wide data ────────────────────────────────────────────────────
const STATS = {
  totalStudents: 5000,
  form1Students: 2500,
  form2Students: 2500,
  totalTeachers: 42,
  totalParents: 3800,
  totalClasses: 24,
  attendanceRate: 91,
  passRate: 87,
  pendingScores: 14,
  reportsGenerated: 320,
};

// Grade distribution (current term)
const GRADE_DIST = [
  { grade: "A1", count: 142, color: "#16a34a" },
  { grade: "B2", count: 118, color: "#2563eb" },
  { grade: "B3", count: 96, color: "#3b82f6" },
  { grade: "C4", count: 72, color: "#ca8a04" },
  { grade: "C5", count: 48, color: "#ea580c" },
  { grade: "C6", count: 36, color: "#f97316" },
  { grade: "D7", count: 28, color: "#dc2626" },
  { grade: "E8", count: 12, color: "#b91c1c" },
  { grade: "F9", count: 8, color: "#7f1d1d" },
];

// Term trend — avg score per term
const TERM_TREND = [
  { term: "T1 23/24", avg: 62, attendance: 88 },
  { term: "T2 23/24", avg: 65, attendance: 90 },
  { term: "T3 23/24", avg: 64, attendance: 87 },
  { term: "T1 24/25", avg: 68, attendance: 91 },
  { term: "T2 24/25", avg: 71, attendance: 91 },
];

// Attendance by year group
const YEAR_ATTENDANCE = [
  { year: "Form 1", present: 94, absent: 6 },
  { year: "Form 2", present: 90, absent: 10 },
  { year: "Form 3", present: 88, absent: 12 },
];

// Department performance

// Track split pie
const TRACK_DATA = [
  { name: "Semester 1 (Gold)", value: 243, color: "#ca8a04" },
  { name: "Semester 2 (Green)", value: 243, color: "#16a34a" },
];

// Program split pie
const PROGRAM_DATA = [
  { name: "General Science", value: 148, color: "var(--royal-blue)" },
  { name: "General Arts", value: 124, color: "#7c3aed" },
  { name: "Business", value: 98, color: "var(--warning)" },
  { name: "Technical", value: 116, color: "var(--accent-red)" },
];

// Recent activity — no emojis, uses type for icon
const RECENT_ACTIVITY = [
  {
    text: "WOI Ama Mensah submitted Form 3A exam scores",
    time: "5 min ago",
    type: "success",
  },
  {
    text: "14 score submissions still pending — deadline Friday",
    time: "1 hr ago",
    type: "warning",
  },
  {
    text: "New teacher Cpt Ebo Darko added to Mathematics dept",
    time: "2 hrs ago",
    type: "info",
  },
  {
    text: "Semester 1 report cards approved for Form 3 Science B",
    time: "3 hrs ago",
    type: "success",
  },
  {
    text: "12 new students enrolled — Form 1 General Science",
    time: "1 day ago",
    type: "info",
  },
  {
    text: "Bulk SMS sent to 380 parents re: Semester 1 exams",
    time: "2 days ago",
    type: "info",
  },
];

// Activity icon map
const ACTIVITY_ICON = {
  success: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--success-dark)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  warning: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--warning)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--royal-blue)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const ACTIVITY_BG = {
  success: "#f0fdf4",
  warning: "#fefce8",
  info: "#eef2ff",
};

// Custom tooltips
const BarTip = ({ active, payload, label }) => {
  if (active && payload?.length)
    return (
      <div
        className="bg-white rounded-xl shadow-lg border px-3 py-2 text-xs"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <p className="font-bold mb-1" style={{ color: "var(--dark-gray)" }}>
          {label}
        </p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}:{" "}
            <strong>
              {p.value}
              {p.unit || ""}
            </strong>
          </p>
        ))}
      </div>
    );
  return null;
};

// ─── Animated counter hook ────────────────────────────────────────────────────
const useCounter = (target, suffix = "", duration = 1800) => {
  const [val, setVal] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setVal(target);
            clearInterval(timer);
          } else {
            setVal(Math.floor(start));
          }
        }, 16);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref, display: val.toLocaleString() + suffix };
};

// ─── Stat card with animated counter ─────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  target,
  suffix = "",
  sub,
  color,
  onClick,
  alert,
}) => {
  const counter = useCounter(target ?? 0, suffix);
  const display = target !== undefined ? counter.display : value;
  return (
    <div
      ref={counter.ref}
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md" : ""} transition-all relative overflow-hidden`}
      style={{ borderColor: "var(--medium-gray)" }}
    >
      {alert && (
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--accent-red)" }}
        />
      )}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-2xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          {display}
        </p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
        {sub && (
          <p
            className="text-xs font-semibold truncate mt-0.5"
            style={{ color }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Section card ─────────────────────────────────────────────────────────────
const Card = ({
  title,
  subtitle,
  children,
  linkTo,
  linkLabel = "View all",
  accentColor = "var(--royal-blue)",
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{
          borderColor: "var(--medium-gray)",
          backgroundColor: "var(--light-gray)",
        }}
      >
        <div>
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {linkTo && (
          <button
            onClick={() => navigate(linkTo)}
            className="text-xs flex items-center gap-1 font-semibold"
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

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
        }}
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <div className="w-56 h-56 rounded-full bg-white absolute -right-16 -top-16" />
          <div className="w-36 h-36 rounded-full bg-white absolute right-10 bottom-4" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
            <h2 className="text-xl sm:text-2xl font-black">
              {user?.name || "Administrator"}
            </h2>
            <p className="text-blue-300 text-xs mt-0.5">
              Armed Forces Senior High Technical School · Admin Portal
            </p>
            <p className="text-blue-300 text-xs">
              Uaddara Barracks, Kumasi, Ghana
            </p>
          </div>
          {/* Info badges */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {[
              { label: "Academic Year", value: "2024 / 2025" },
              { label: "Current Semester", value: "Semester 1" },
              { label: "System", value: "Transitional" },
              { label: "Location", value: "Kumasi, Ghana" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <span className="text-xs text-blue-300">{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Total Students"
          target={STATS.totalStudents}
          suffix="+"
          color="var(--royal-blue)"
          onClick={() => navigate("/dashboard/students")}
        />
        <StatCard
          icon={Users}
          label="Total Teachers"
          target={STATS.totalTeachers}
          suffix="+"
          color="#7c3aed"
          onClick={() => navigate("/dashboard/teacher")}
        />
        <StatCard
          icon={UserCheck}
          label="Total Parents"
          target={STATS.totalParents}
          suffix="+"
          color="var(--success-dark)"
          onClick={() => navigate("/dashboard/parents")}
        />
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          target={STATS.totalClasses}
          suffix="+"
          color="var(--warning)"
          onClick={() => navigate("/dashboard/academicStructure2")}
        />
      </div>

      {/* Charts row 1 — Grade distribution + Term trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade distribution */}
        <Card title="Grade Distribution" subtitle="Current Term · All students">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={GRADE_DIST}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip content={<BarTip />} />
              <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                {GRADE_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Credit pass summary */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "#f0fdf4" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--success-dark)" }}
              >
                {GRADE_DIST.filter((g) =>
                  ["A1", "B2", "B3", "C4", "C5", "C6"].includes(g.grade),
                ).reduce((s, g) => s + g.count, 0)}
              </p>
              <p className="text-xs text-gray-500">Credit Passes (A1–C6)</p>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "#fff1f2" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--accent-red)" }}
              >
                {GRADE_DIST.filter((g) =>
                  ["D7", "E8", "F9"].includes(g.grade),
                ).reduce((s, g) => s + g.count, 0)}
              </p>
              <p className="text-xs text-gray-500">Below Credit (D7–F9)</p>
            </div>
          </div>
        </Card>

        {/* Term trend */}
        <Card
          title="Performance Trend"
          subtitle="Avg score & attendance — last 5 terms"
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={TERM_TREND}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--royal-blue)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--royal-blue)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--success-dark)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--success-dark)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="term" tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                domain={[50, 100]}
              />
              <Tooltip content={<BarTip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="avg"
                name="Avg Score (%)"
                stroke="var(--royal-blue)"
                fill="url(#avgGrad)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                name="Attendance (%)"
                stroke="var(--success-dark)"
                fill="url(#attGrad)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 — Dept perf + Enrollment split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment by program */}
        <div className="lg:col-span-2">
          <Card title="Enrollment by Programme" subtitle="Total 486 students">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={PROGRAM_DATA}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PROGRAM_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v} students`, n]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Charts row 3 — Attendance + Track + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance by year group */}
        <Card title="Attendance by Year Group" subtitle="This term">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={YEAR_ATTENDANCE}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                domain={[0, 100]}
              />
              <Tooltip content={<BarTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="present"
                name="Present (%)"
                stackId="a"
                fill="var(--success-dark)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="absent"
                name="Absent (%)"
                stackId="a"
                fill="var(--accent-red)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Track split */}
        <Card
          title="Transitional System Split"
          subtitle="Semester 1 in session · Semester 2 on vacation"
        >
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={TRACK_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {TRACK_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [`${v} students`, n]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent activity */}
        <Card title="Recent Activity" subtitle="Last 24 hours">
          <div className="space-y-3">
            {RECENT_ACTIVITY.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: ACTIVITY_BG[a.type] }}
                >
                  {ACTIVITY_ICON[a.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {a.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div
        className="bg-white rounded-xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="font-semibold text-sm mb-4"
          style={{ color: "var(--dark-gray)" }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Add Teacher",
              icon: Users,
              path: "/dashboard/teacher",
              color: "var(--royal-blue)",
            },
            {
              label: "Add Student",
              icon: GraduationCap,
              path: "/dashboard/students",
              color: "#7c3aed",
            },
            {
              label: "Report Template",
              icon: FileText,
              path: "/dashboard/reportTemplate",
              color: "var(--success-dark)",
            },
            {
              label: "Bulk Message",
              icon: Bell,
              path: "/dashboard/bulkCommunication",
              color: "var(--warning)",
            },
            {
              label: "User Management",
              icon: UserCheck,
              path: "/dashboard/userManagement",
              color: "var(--info)",
            },
            {
              label: "Audit Logs",
              icon: Activity,
              path: "/dashboard/auditLogs",
              color: "var(--accent-red)",
            },
          ].map(({ label, icon: Icon, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-sm active:scale-95"
              style={{
                borderColor: color + "30",
                backgroundColor: color + "08",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = color + "30")
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: color + "15" }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <span
                className="text-xs font-semibold text-center leading-tight"
                style={{ color: "var(--dark-gray)" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
