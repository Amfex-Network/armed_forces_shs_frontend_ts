// src/admin/academic-structure1/DoubleTruckManagement.jsx
import React, { useState } from "react";
import {
  Save,
  ArrowRightLeft,
  CheckCircle2,
  Users,
  Calendar,
} from "lucide-react";
import { STUDENTS } from "../data/adminData";

const INIT = {
  A: {
    id: "A",
    name: "Track A",
    color: "#854d0e",
    bg: "#fefce8",
    border: "#fcd34d",
    status: "active",
    terms: [
      { n: 1, start: "2024-09-02", end: "2024-12-13", isCurrent: false },
      { n: 2, start: "2025-01-06", end: "2025-04-11", isCurrent: true },
      { n: 3, start: "2025-04-14", end: "2025-07-25", isCurrent: false },
    ],
  },
  B: {
    id: "B",
    name: "Track B",
    color: "#166534",
    bg: "#f0fdf4",
    border: "#86efac",
    status: "vacation",
    terms: [
      { n: 1, start: "2024-12-16", end: "2025-04-11", isCurrent: true },
      { n: 2, start: "2025-04-14", end: "2025-07-25", isCurrent: false },
      { n: 3, start: "2025-07-28", end: "2025-11-07", isCurrent: false },
    ],
  },
};

const DoubleTruckManagement = () => {
  const [tracks, setTracks] = useState(INIT);
  const [confirm, setConfirm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateTerm = (tid, n, field, val) => {
    setTracks((t) => ({
      ...t,
      [tid]: {
        ...t[tid],
        terms: t[tid].terms.map((tm) =>
          tm.n === n ? { ...tm, [field]: val } : tm,
        ),
      },
    }));
  };

  const handleSwitch = () => {
    setTracks((t) => ({
      A: { ...t.A, status: t.A.status === "active" ? "vacation" : "active" },
      B: { ...t.B, status: t.B.status === "active" ? "vacation" : "active" },
    }));
    setConfirm(false);
    showToast("Track status switched successfully");
  };

  const students = STUDENTS.filter((s) => {
    const q = search.toLowerCase();
    const ok = filter === "all" || s.track === filter;
    const sq =
      !q ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q);
    return ok && sq;
  });

  const DateIn = ({ value, onChange }) => (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1.5 text-xs rounded-lg border-2 outline-none"
      style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
    />
  );

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
        >
          <CheckCircle2 size={14} /> {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Double Track Management
          </h2>
          <p className="text-xs text-gray-400">
            Track A / B term dates and status
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Track configuration saved")}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Save size={14} /> Save Changes
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Track A Students",
            value: STUDENTS.filter((s) => s.track === "A").length,
            color: "#854d0e",
          },
          {
            label: "Track B Students",
            value: STUDENTS.filter((s) => s.track === "B").length,
            color: "#166534",
          },
          {
            label: "Track A Classes",
            value: [
              ...new Set(
                STUDENTS.filter((s) => s.track === "A").map((s) => s.formClass),
              ),
            ].filter(Boolean).length,
            color: "var(--royal-blue)",
          },
          {
            label: "Track B Classes",
            value: [
              ...new Set(
                STUDENTS.filter((s) => s.track === "B").map((s) => s.formClass),
              ),
            ].filter(Boolean).length,
            color: "#7c3aed",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-3 text-center shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-2xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Track cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Object.values(tracks).map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: track.border, borderWidth: 2 }}
          >
            <div
              className="p-4"
              style={{
                background: `linear-gradient(135deg,${track.color}18,${track.color}08)`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className="text-lg font-black"
                    style={{ color: track.color }}
                  >
                    Track {track.id}
                  </h3>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        track.status === "active" ? "#f0fdf4" : "#fff1f2",
                      color:
                        track.status === "active"
                          ? "var(--success-dark)"
                          : "var(--accent-red)",
                    }}
                  >
                    ● {track.status === "active" ? "In Session" : "On Vacation"}
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-black"
                    style={{ color: track.color }}
                  >
                    {STUDENTS.filter((s) => s.track === track.id).length}
                  </p>
                  <p className="text-xs text-gray-400">students</p>
                </div>
              </div>
              <div className="space-y-2">
                {track.terms.map((tm) => (
                  <div
                    key={tm.n}
                    className="bg-white rounded-xl p-3 border"
                    style={{ borderColor: track.border }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className="text-xs font-bold"
                        style={{ color: track.color }}
                      >
                        Term {tm.n}
                      </p>
                      {tm.isCurrent && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-bold text-white"
                          style={{ backgroundColor: track.color }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Start</p>
                        <DateIn
                          value={tm.start}
                          onChange={(v) =>
                            updateTerm(track.id, tm.n, "start", v)
                          }
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">End</p>
                        <DateIn
                          value={tm.end}
                          onChange={(v) => updateTerm(track.id, tm.n, "end", v)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Switch */}
      <div
        className="bg-white rounded-2xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="font-black text-sm"
              style={{ color: "var(--dark-gray)" }}
            >
              Switch Active Track
            </p>
            <p className="text-xs text-gray-400">
              Track A is In Session · Track B is On Vacation
            </p>
          </div>
          {!confirm ? (
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl"
              style={{ backgroundColor: "#7c3aed" }}
            >
              <ArrowRightLeft size={14} /> Switch Tracks
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--warning)" }}
              >
                ⚠ Confirm switch?
              </p>
              <button
                type="button"
                onClick={handleSwitch}
                className="px-3 py-1.5 text-xs font-bold text-white rounded-lg"
                style={{ backgroundColor: "var(--success-dark)" }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Students table */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <p
            className="text-sm font-black flex-1"
            style={{ color: "var(--dark-gray)" }}
          >
            Student Track Assignments
          </p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="px-3 py-1.5 text-xs rounded-lg border outline-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
          {["all", "A", "B"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: filter === f ? "var(--royal-blue)" : "white",
                color: filter === f ? "white" : "var(--dark-gray)",
                border: "1px solid var(--medium-gray)",
              }}
            >
              {f === "all" ? "All" : `Track ${f}`}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-sm min-w-[500px]">
            <thead
              className="sticky top-0 border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Student", "ID", "Form Class", "Track", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td
                    className="px-4 py-2.5 font-semibold text-sm"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500">
                    {s.studentId}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {s.formClass}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          s.track === "A" ? "#fefce8" : "#f0fdf4",
                        color: s.track === "A" ? "#854d0e" : "#166534",
                      }}
                    >
                      Track {s.track}
                    </span>
                  </td>
                  <td
                    className="px-4 py-2.5 text-xs font-semibold"
                    style={{
                      color:
                        s.status === "Active"
                          ? "var(--success-dark)"
                          : s.status === "Inactive"
                            ? "var(--accent-red)"
                            : "var(--warning)",
                    }}
                  >
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="px-4 py-2 text-xs text-gray-400 border-t"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          Showing {students.length} of {STUDENTS.length} students
        </div>
      </div>
    </div>
  );
};
export default DoubleTruckManagement;
