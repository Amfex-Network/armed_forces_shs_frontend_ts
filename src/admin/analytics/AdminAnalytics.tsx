import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  Shield,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { statsApi, type Overview } from "../../api/stats";
import { useSettings } from "../../context/SettingsContext";

const COLORS = [
  "var(--royal-blue)",
  "var(--success-dark)",
  "var(--warning)",
  "#7c3aed",
  "var(--accent-red)",
  "#0891b2",
];

const AdminAnalytics = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi
      .overview()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="py-20 text-center text-sm text-gray-400">Loading analytics…</div>;

  const s = stats || {
    students: 0,
    teachers: 0,
    parents: 0,
    admins: 0,
    reports: 0,
    byCourse: [],
  };

  const cards = [
    { label: "Students", value: s.students, color: "var(--royal-blue)", icon: GraduationCap },
    { label: "Teachers", value: s.teachers, color: "var(--success-dark)", icon: UserCheck },
    { label: "Parents", value: s.parents, color: "#7c3aed", icon: Users },
    { label: "Admins", value: s.admins, color: "var(--accent-red)", icon: Shield },
  ];

  const courseData = (s.byCourse || []).map((c) => ({
    name: c.course.replace("General ", ""),
    count: c.count,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
          Analytics
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Live figures · {settings.currentAcademicYear} · {settings.currentTerm}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "18" }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: "var(--dark-gray)" }}>
                {value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {courseData.length === 0 ? (
        <div
          className="bg-white rounded-xl border shadow-sm py-16 text-center"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <Info size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-400">
            No enrolment data yet. Charts appear once students are registered
            with courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "var(--medium-gray)" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--dark-gray)" }}>
              Students by Course
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={courseData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {courseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "var(--medium-gray)" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--dark-gray)" }}>
              Course Distribution
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={courseData} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="name" label>
                  {courseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div
        className="flex items-start gap-3 p-4 rounded-xl border text-xs"
        style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
      >
        <Info size={15} style={{ color: "var(--royal-blue)" }} className="flex-shrink-0 mt-0.5" />
        <p style={{ color: "#1e40af" }}>
          These figures are pulled live from the database. Term-over-term
          performance trends will populate as more results are entered and
          published across terms.
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
