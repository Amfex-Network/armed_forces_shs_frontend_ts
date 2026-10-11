import React, { useEffect, useState } from "react";
import { GraduationCap, Shield, UserCheck, Users } from "lucide-react";
import { statsApi, type Overview } from "../../api/stats";
import { classesApi } from "../../api/domains";
import { analyticsApi, type AnalyticsReport } from "../../api/analytics";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";
import {
  AnalyticsPdfPanel,
  AnalyticsReportView,
} from "../../components/analytics/AnalyticsReportView";
import { PeriodPicker } from "../../components/analytics/PeriodPicker";

const AdminAnalytics = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [stats, setStats] = useState<Overview | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [term, setTerm] = useState(settings.currentTerm);
  const [academicYear, setAcademicYear] = useState(
    settings.currentAcademicYear,
  );
  const [className, setClassName] = useState("");
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTerm(settings.currentTerm);
    setAcademicYear(settings.currentAcademicYear);
  }, [settings.currentTerm, settings.currentAcademicYear]);

  useEffect(() => {
    statsApi
      .overview()
      .then(setStats)
      .catch(() => setStats(null));
    classesApi
      .list()
      .then((cls) =>
        setClasses(
          cls
            .map((c) => c.name)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
        ),
      )
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    analyticsApi
      .get({ term, academicYear, className })
      .then((res) => alive && setReport(res.report))
      .catch((err) => {
        if (!alive) return;
        setReport(null);
        setError(err?.message || "Could not load analytics.");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [term, academicYear, className]);

  const people = [
    {
      label: "Students",
      value: stats?.students,
      color: "var(--royal-blue)",
      icon: GraduationCap,
    },
    {
      label: "Teachers",
      value: stats?.teachers,
      color: "var(--success-dark)",
      icon: UserCheck,
    },
    { label: "Parents", value: stats?.parents, color: "#7c3aed", icon: Users },
    {
      label: "Admins",
      value: stats?.admins,
      color: "var(--accent-red)",
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Live figures from score entry and attendance
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <PeriodPicker
            term={term}
            academicYear={academicYear}
            onTerm={setTerm}
            onYear={setAcademicYear}
          />
          <label className="text-xs text-gray-500">
            <span className="block mb-1">Class</span>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border-2 bg-white"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <option value="">Whole school</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {people.map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p
                className="text-xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value ?? "-"}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && !report ? (
        <p className="py-16 text-center text-sm text-gray-400">
          Loading analytics…
        </p>
      ) : error ? (
        <p
          className="py-16 text-center text-sm"
          style={{ color: "var(--accent-red)" }}
        >
          {error}
        </p>
      ) : report ? (
        <>
          <AnalyticsPdfPanel
            report={report}
            schoolName={settings.schoolName}
            scope={className || "Whole School"}
            preparedBy={user?.name || user?.email || "Administrator"}
          />
          <AnalyticsReportView report={report} />
        </>
      ) : null}
    </div>
  );
};

export default AdminAnalytics;
