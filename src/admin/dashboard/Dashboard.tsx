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
import { useSettings } from "../../context/SettingsContext";
import { statsApi } from "../../api/stats";

const PROGRAM_COLORS = [
  "var(--royal-blue)",
  "#7c3aed",
  "var(--warning)",
  "var(--accent-red)",
  "var(--success-dark)",
  "#0369a1",
];

const GRADE_COLORS: Record<string, string> = {
  A1: "#16a34a",
  B2: "#2563eb",
  B3: "#3b82f6",
  C4: "#ca8a04",
  C5: "#ea580c",
  C6: "#f97316",
  D7: "#dc2626",
  E8: "#b91c1c",
  F9: "#7f1d1d",
};

const TRANSITION_COLORS: Record<string, string> = {
  "Transition One": "#ca8a04",
  "Transition Two": "#16a34a",
  "Not set": "#9ca3af",
};

const timeAgo = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
};

const NoData = ({ label = "No data yet" }) => (
  <div className="h-[160px] flex items-center justify-center text-sm text-gray-400">
    {label}
  </div>
);

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

// Animated counter hook
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

// Stat card with animated counter
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

// Section card
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

// Dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [stats, setStats] = React.useState({
    students: 0,
    teachers: 0,
    parents: 0,
    admins: 0,
    reports: 0,
    passRate: 0,
    totalScores: 0,
    byCourse: [] as { course: string; count: number }[],
    byGrade: [] as { grade: string; count: number }[],
    byTransition: [] as { name: string; count: number }[],
    attendanceByYear: [] as { year: string; present: number; absent: number }[],
    termTrend: [] as { term: string; avg: number }[],
    recentActivity: [] as { text: string; status: string; date: string }[],
  });

  React.useEffect(() => {
    statsApi
      .overview()
      .then((s) => setStats((prev) => ({ ...prev, ...s })))
      .catch(() => {});
  }, []);

  const programData = (stats.byCourse || []).map((c, i) => ({
    name: c.course,
    value: c.count,
    color: PROGRAM_COLORS[i % PROGRAM_COLORS.length],
  }));

  const TERM_TREND = stats.termTrend || [];
  const YEAR_ATTENDANCE = stats.attendanceByYear || [];
  const TRACK_DATA = (stats.byTransition || []).map((t) => ({
    name: t.name,
    value: t.count,
    color: TRANSITION_COLORS[t.name] || "#6b7280",
  }));
  const RECENT_ACTIVITY = (stats.recentActivity || []).map((a) => ({
    text: a.text,
    time: timeAgo(a.date),
    type: a.status === "failed" ? "warning" : "success",
  }));

  const gradeDist =
    stats.totalScores > 0
      ? (stats.byGrade || []).map((g) => ({
          ...g,
          color: GRADE_COLORS[g.grade] || "#6b7280",
        }))
      : [];

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
              { label: "Academic Year", value: settings.currentAcademicYear },
              { label: "Current Term", value: settings.currentTerm },
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
          target={stats.students}
          color="var(--royal-blue)"
          onClick={() => navigate("/dashboard/students")}
        />
        <StatCard
          icon={Users}
          label="Total Teachers"
          target={stats.teachers}
          color="#7c3aed"
          onClick={() => navigate("/dashboard/teacher")}
        />
        <StatCard
          icon={UserCheck}
          label="Total Parents"
          target={stats.parents}
          color="var(--success-dark)"
          onClick={() => navigate("/dashboard/parents")}
        />
        <StatCard
          icon={BookOpen}
          label="Total Reports"
          target={stats.reports}
          color="var(--warning)"
          onClick={() => navigate("/dashboard/publishReports")}
        />
      </div>

      {/* Charts row 1 - Grade distribution + Term trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade distribution */}
        <Card title="Grade Distribution" subtitle="Current Term · All students">
          {gradeDist.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={gradeDist}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="grade"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip content={<BarTip />} />
                <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                  {gradeDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData label="No grades recorded yet" />
          )}
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
                {gradeDist
                  .filter((g) =>
                    ["A1", "B2", "B3", "C4", "C5", "C6"].includes(g.grade),
                  )
                  .reduce((s, g) => s + g.count, 0)}
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
                {gradeDist
                  .filter((g) => ["D7", "E8", "F9"].includes(g.grade))
                  .reduce((s, g) => s + g.count, 0)}
              </p>
              <p className="text-xs text-gray-500">Below Credit (D7–F9)</p>
            </div>
          </div>
        </Card>

        {/* Term trend */}
        <Card
          title="Performance Trend"
          subtitle="Average score, last 5 terms with scores"
        >
          {TERM_TREND.length ? (
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
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="term"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  domain={[0, 100]}
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
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <NoData label="No performance data yet" />
          )}
        </Card>
      </div>

      {/* Charts row 2 - Dept perf + Enrollment split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment by program */}
        <div className="lg:col-span-2">
          <Card
            title="Enrollment by Programme"
            subtitle={`Total ${stats.students} students`}
          >
            {programData.length ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={programData}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {programData.map((entry, i) => (
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
            ) : (
              <NoData label="No students enrolled yet" />
            )}
          </Card>
        </div>
      </div>

      {/* Charts row 3 - Attendance + Transition + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance by year group */}
        <Card
          title="Attendance by Year Group"
          subtitle={`${settings.currentTerm} ${settings.currentAcademicYear}`}
        >
          {YEAR_ATTENDANCE.length ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={YEAR_ATTENDANCE}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
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
          ) : (
            <NoData label="No attendance data yet" />
          )}
        </Card>

        {/* Transition split */}
        <Card
          title="Students by Transition"
          subtitle="Transition One and Transition Two"
        >
          {TRACK_DATA.length ? (
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
          ) : (
            <NoData label="No students enrolled yet" />
          )}
        </Card>

        {/* Recent activity */}
        <Card title="Recent Activity" subtitle="Last 24 hours">
          {RECENT_ACTIVITY.length === 0 && (
            <NoData label="No recent activity" />
          )}
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
