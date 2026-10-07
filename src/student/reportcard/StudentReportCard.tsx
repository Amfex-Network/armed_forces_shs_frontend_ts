// src/student/reportcard/StudentReportCard.tsx
import {
  TerminalReport,
  PrintableReport,
} from "../../components/report/TerminalReport";
import React, { useState, useEffect } from "react";
import { Printer, ChevronDown } from "lucide-react";
import { resultsApi, type ReportResult } from "../../api/results";
import { useSettings } from "../../context/SettingsContext";

const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ backgroundColor: "#eef2ff" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--royal-blue)"
        strokeWidth="2"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
    <h2
      className="text-lg font-black mb-2"
      style={{ color: "var(--dark-gray)" }}
    >
      {title}
    </h2>
    <p className="text-sm text-gray-400 max-w-sm">{message}</p>
  </div>
);

const StudentReportCard = () => {
  const { settings } = useSettings();
  const TERMS = settings.terms;
  const ACADEMIC_YEAR = settings.currentAcademicYear;
  const [term, setTerm] = useState(settings.currentTerm);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    resultsApi
      .get({ term, academicYear: ACADEMIC_YEAR })
      .then((r) => {
        if (active) setResult(r);
      })
      .catch((e) => {
        if (active) {
          setResult(null);
          setError(e?.message || "Could not load your report.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [term, ACADEMIC_YEAR]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Loading your report…
      </div>
    );
  if (error || !result)
    return (
      <EmptyState
        title="Report Card Not Available"
        message={
          error ||
          "We couldn't find your report. Make sure your student record is linked to your account."
        }
      />
    );
  if (result.published === false)
    return (
      <EmptyState
        title="Report Card Not Yet Published"
        message={`Your ${term} report has not been published yet. Please check back after the admin finalizes and publishes the reports.`}
      />
    );
  if (result.subjects.length === 0)
    return (
      <EmptyState
        title="No Results Yet"
        message={`No scores have been recorded for ${term} yet. Please check back later.`}
      />
    );

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Report Card
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            View and print your terminal report
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
              style={{
                borderColor: "var(--royal-blue)",
                color: "var(--royal-blue)",
                backgroundColor: "#eef2ff",
              }}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t} · {ACADEMIC_YEAR}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--royal-blue)" }}
            />
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl transition"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border shadow-sm overflow-x-auto p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="min-w-[640px]">
          <TerminalReport result={result} settings={settings} />
        </div>
      </div>
      <PrintableReport result={result} settings={settings} />
    </div>
  );
};

export default StudentReportCard;
