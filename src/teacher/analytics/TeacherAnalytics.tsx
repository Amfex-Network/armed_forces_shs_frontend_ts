import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  analyticsApi,
  VIEW_LABELS,
  type AnalyticsReport,
  type AnalyticsView,
} from "../../api/analytics";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";
import {
  AnalyticsPdfPanel,
  AnalyticsReportView,
} from "../../components/analytics/AnalyticsReportView";
import { PeriodPicker } from "../../components/analytics/PeriodPicker";

const VIEW_HINTS: Record<AnalyticsView, string> = {
  school: "",
  teaching: "The subjects you teach, in the classes you teach them.",
  form: "Every subject for the students in your form class.",
  department: "Your department's subjects across all classes.",
};

const TeacherAnalytics = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [views, setViews] = useState<AnalyticsView[] | null>(null);
  const [view, setView] = useState<AnalyticsView | "">("");
  const [term, setTerm] = useState(settings.currentTerm);
  const [academicYear, setAcademicYear] = useState(
    settings.currentAcademicYear,
  );
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTerm(settings.currentTerm);
    setAcademicYear(settings.currentAcademicYear);
  }, [settings.currentTerm, settings.currentAcademicYear]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    analyticsApi
      .get({ view: view || undefined, term, academicYear, className })
      .then((res) => {
        if (!alive) return;
        setViews(res.views);
        if (!view && res.view) setView(res.view);
        setReport(res.report);
        // The class list comes from the unfiltered view.
        if (!className && res.report) {
          setClasses(res.report.classes.map((c) => c.className));
        }
      })
      .catch((err) => {
        if (!alive) return;
        setReport(null);
        setError(err?.message || "Could not load analytics.");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [view, term, academicYear, className]);

  const changeView = (v: AnalyticsView) => {
    setClassName("");
    setView(v);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#eef2ff" }}
          >
            <BarChart3 size={18} style={{ color: "var(--royal-blue)" }} />
          </div>
          <div>
            <h1
              className="text-xl font-black"
              style={{ color: "var(--dark-gray)" }}
            >
              Analytics
            </h1>
            <p className="text-xs text-gray-400">
              {view ? VIEW_HINTS[view] : "Performance in your classes"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <PeriodPicker
            term={term}
            academicYear={academicYear}
            onTerm={setTerm}
            onYear={setAcademicYear}
          />
          {classes.length > 1 && (
            <label className="text-xs text-gray-500">
              <span className="block mb-1">Class</span>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border-2 bg-white"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <option value="">All my classes</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {views && views.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {views.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => changeView(v)}
              className="px-4 py-2 text-sm font-semibold rounded-xl border-2 transition"
              style={{
                borderColor:
                  view === v ? "var(--royal-blue)" : "var(--medium-gray)",
                backgroundColor: view === v ? "#eef2ff" : "white",
                color: view === v ? "var(--royal-blue)" : "var(--dark-gray)",
              }}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      )}

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
      ) : views && views.length === 0 ? (
        <div
          className="p-6 rounded-xl border text-sm text-center"
          style={{
            borderColor: "var(--medium-gray)",
            color: "var(--dark-gray)",
          }}
        >
          You have no classes or subjects assigned yet, so there is nothing to
          analyse. Ask the admin to assign your classes under Teachers.
        </div>
      ) : report && view ? (
        <>
          <AnalyticsPdfPanel
            report={report}
            schoolName={settings.schoolName}
            scope={className || VIEW_LABELS[view]}
            preparedBy={user?.name || user?.email || "Teacher"}
          />
          <AnalyticsReportView report={report} />
        </>
      ) : null}
    </div>
  );
};

export default TeacherAnalytics;
