// src/teacher/timetable/TeacherTimetable.jsx
import React, { useState } from "react";
import { Clock, BookOpen, Users, RefreshCw, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { TERM_INFO } from "../data/teacherData";

const PERIODS = [
  { label: "Period 1", time: "07:30–08:20" },
  { label: "Period 2", time: "08:20–09:10" },
  { label: "Period 3", time: "09:10–10:00" },
  { label: "Break", time: "10:00–10:20" },
  { label: "Period 4", time: "10:20–11:10" },
  { label: "Period 5", time: "11:10–12:00" },
  { label: "Period 6", time: "12:00–12:50" },
  { label: "Lunch", time: "12:50–13:30" },
  { label: "Period 7", time: "13:30–14:20" },
  { label: "Period 8", time: "14:20–15:10" },
];

const SUBJECT_COLORS = {
  Mathematics: { bg: "#eef2ff", color: "var(--royal-blue)" },
  "Core Mathematics": { bg: "#eef2ff", color: "var(--royal-blue)" },
  "English Language": { bg: "#f0fdf4", color: "var(--success-dark)" },
  Physics: { bg: "#fff1f2", color: "var(--accent-red)" },
  Chemistry: { bg: "#fef3c7", color: "#92400e" },
  Biology: { bg: "#ecfdf5", color: "#065f46" },
  ICT: { bg: "#f0f9ff", color: "#0369a1" },
  "Social Studies": { bg: "#f5f3ff", color: "#7c3aed" },
  Free: { bg: "#f9fafb", color: "#9ca3af" },
  Break: { bg: "#f3f4f6", color: "#6b7280" },
  Lunch: { bg: "#f3f4f6", color: "#6b7280" },
  Meeting: { bg: "#fffbeb", color: "var(--warning)" },
};

// Mock timetable — keyed by day
const TEACHER_TIMETABLE = {
  Monday: [
    {
      subject: "Core Mathematics",
      class: "Form 3 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 2 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 1 Science A",
      room: "Block A Rm 2",
      type: "class",
    },
    { subject: "Break", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science B",
      room: "Block A Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
    {
      subject: "Core Mathematics",
      class: "Form 2 Arts A",
      room: "Block B Rm 3",
      type: "class",
    },
    { subject: "Lunch", class: "", room: "", type: "break" },
    {
      subject: "Meeting",
      class: "HOD Meeting",
      room: "Conference Rm",
      type: "meeting",
    },
    { subject: "Free", class: "", room: "", type: "free" },
  ],
  Tuesday: [
    {
      subject: "Core Mathematics",
      class: "Form 1 Science A",
      room: "Block A Rm 2",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 2 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
    { subject: "Break", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 1 Business A",
      room: "Block C Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
    { subject: "Lunch", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science B",
      room: "Block A Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
  ],
  Wednesday: [
    { subject: "Free", class: "", room: "", type: "free" },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 2 Arts A",
      room: "Block B Rm 3",
      type: "class",
    },
    { subject: "Break", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 2 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 1 Science A",
      room: "Block A Rm 2",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
    { subject: "Lunch", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 1 Business A",
      room: "Block C Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
  ],
  Thursday: [
    {
      subject: "Core Mathematics",
      class: "Form 3 Science B",
      room: "Block A Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
    {
      subject: "Core Mathematics",
      class: "Form 2 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    { subject: "Break", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 1 Science A",
      room: "Block A Rm 2",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 2 Arts A",
      room: "Block B Rm 3",
      type: "class",
    },
    { subject: "Lunch", class: "", room: "", type: "break" },
    { subject: "Free", class: "", room: "", type: "free" },
    { subject: "Free", class: "", room: "", type: "free" },
  ],
  Friday: [
    {
      subject: "Core Mathematics",
      class: "Form 2 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science A",
      room: "Block A Rm 1",
      type: "class",
    },
    {
      subject: "Core Mathematics",
      class: "Form 1 Business A",
      room: "Block C Rm 1",
      type: "class",
    },
    { subject: "Break", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 3 Science B",
      room: "Block A Rm 1",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
    {
      subject: "Meeting",
      class: "Staff Meeting",
      room: "Main Hall",
      type: "meeting",
    },
    { subject: "Lunch", class: "", room: "", type: "break" },
    {
      subject: "Core Mathematics",
      class: "Form 2 Arts A",
      room: "Block B Rm 3",
      type: "class",
    },
    { subject: "Free", class: "", room: "", type: "free" },
  ],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TeacherTimetable = () => {
  const { user } = useAuth();
  const [view, setView] = useState("week");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const today = DAYS[new Date().getDay() - 1] || "Monday";

  const totalClasses = Object.values(TEACHER_TIMETABLE)
    .flat()
    .filter((s) => s.type === "class").length;

  const todayClasses = (TEACHER_TIMETABLE[today] || []).filter(
    (s) => s.type === "class",
  ).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            My Timetable
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {TERM_INFO.term} · {TERM_INFO.academicYear} ·{" "}
            {user?.subject || "Core Mathematics"}
          </p>
        </div>
        <div className="flex gap-2">
          {["week", "day"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="text-sm font-semibold px-4 py-2 rounded-xl capitalize transition"
              style={{
                backgroundColor: view === v ? "var(--royal-blue)" : "white",
                color: view === v ? "white" : "var(--dark-gray)",
                border: "1px solid var(--medium-gray)",
              }}
            >
              {v} View
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Periods/Week",
            value: totalClasses,
            color: "var(--royal-blue)",
          },
          {
            label: "Today's Classes",
            value: todayClasses,
            color: "var(--success-dark)",
          },
          {
            label: "Max Periods",
            value: user?.maxPeriods || 30,
            color: "var(--warning)",
          },
          {
            label: "Track",
            value: `Track ${user?.track || "A"}`,
            color: "#7c3aed",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 text-center shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-2xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Track info */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl border"
        style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
      >
        <RefreshCw
          size={15}
          style={{ color: "var(--warning)" }}
          className="flex-shrink-0"
        />
        <p className="text-xs font-semibold" style={{ color: "#92400e" }}>
          Track {user?.track || "A"} — currently in session · {TERM_INFO.term} ·{" "}
          {TERM_INFO.academicYear}
        </p>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => {
              setSelectedDay(day);
              setView("day");
            }}
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition"
            style={{
              backgroundColor:
                selectedDay === day && view === "day"
                  ? "var(--royal-blue)"
                  : day === today
                    ? "#eef2ff"
                    : "white",
              color:
                selectedDay === day && view === "day"
                  ? "white"
                  : day === today
                    ? "var(--royal-blue)"
                    : "var(--dark-gray)",
              border: "1px solid var(--medium-gray)",
              fontWeight: day === today ? 700 : undefined,
            }}
          >
            {day.slice(0, 3)}
            {day === today ? " ●" : ""}
          </button>
        ))}
      </div>

      {/* Week view */}
      {view === "week" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--light-gray)" }}>
                  <th
                    className="px-3 py-3 text-left font-bold uppercase text-gray-500 border-b border-r w-28"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    Period
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d}
                      className="px-3 py-3 text-center font-bold uppercase text-gray-500 border-b border-r"
                      style={{
                        borderColor: "var(--medium-gray)",
                        color: d === today ? "var(--royal-blue)" : undefined,
                      }}
                    >
                      {d.slice(0, 3)}
                      {d === today ? " ●" : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pIdx) => {
                  const isBreak =
                    period.label === "Break" || period.label === "Lunch";
                  return (
                    <tr
                      key={pIdx}
                      style={{
                        backgroundColor: isBreak ? "#f9fafb" : undefined,
                      }}
                    >
                      <td
                        className="px-3 py-2 border-b border-r"
                        style={{ borderColor: "var(--medium-gray)" }}
                      >
                        <p
                          className="font-semibold"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {period.label}
                        </p>
                        <p className="text-gray-400 text-xs">{period.time}</p>
                      </td>
                      {DAYS.map((d) => {
                        const slot = TEACHER_TIMETABLE[d]?.[pIdx];
                        const style = SUBJECT_COLORS[slot?.subject] || {
                          bg: "white",
                          color: "#6b7280",
                        };
                        return (
                          <td
                            key={d}
                            className="px-2 py-2 border-b border-r text-center"
                            style={{ borderColor: "var(--medium-gray)" }}
                          >
                            {slot && slot.type === "class" ? (
                              <div
                                className="rounded-lg px-1.5 py-1.5"
                                style={{ backgroundColor: style.bg }}
                              >
                                <p
                                  className="font-bold truncate"
                                  style={{ color: style.color }}
                                >
                                  {slot.subject}
                                </p>
                                <p
                                  className="text-gray-500 truncate"
                                  style={{ fontSize: "10px" }}
                                >
                                  {slot.class}
                                </p>
                                {slot.room && (
                                  <p
                                    className="text-gray-400 truncate"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {slot.room}
                                  </p>
                                )}
                              </div>
                            ) : slot?.type === "meeting" ? (
                              <div
                                className="rounded-lg px-1.5 py-1.5"
                                style={{ backgroundColor: "#fffbeb" }}
                              >
                                <p
                                  className="font-bold truncate"
                                  style={{
                                    color: "var(--warning)",
                                    fontSize: "10px",
                                  }}
                                >
                                  {slot.class}
                                </p>
                                {slot.room && (
                                  <p
                                    className="text-gray-400 truncate"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {slot.room}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-300">
                                {isBreak ? period.label : "—"}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Day view */}
      {view === "day" && (
        <div className="space-y-3">
          <h3
            className="font-bold text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            {selectedDay}
            {selectedDay === today ? " (Today)" : ""}
          </h3>
          {PERIODS.map((period, pIdx) => {
            const slot = TEACHER_TIMETABLE[selectedDay]?.[pIdx];
            const style = SUBJECT_COLORS[slot?.subject] || {
              bg: "white",
              color: "#6b7280",
            };
            const isBreak =
              period.label === "Break" || period.label === "Lunch";

            return (
              <div
                key={pIdx}
                className="flex items-center gap-4 bg-white rounded-xl border p-4 shadow-sm"
                style={{
                  borderColor: "var(--medium-gray)",
                  opacity: isBreak ? 0.6 : 1,
                }}
              >
                <div className="w-20 flex-shrink-0 text-center">
                  <p
                    className="text-xs font-bold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {period.label}
                  </p>
                  <p className="text-xs text-gray-400">{period.time}</p>
                </div>
                <div
                  className="w-1 h-12 rounded-full flex-shrink-0"
                  style={{ backgroundColor: style.color }}
                />
                <div className="flex-1 min-w-0">
                  {slot?.type === "class" ? (
                    <>
                      <p
                        className="font-bold text-sm"
                        style={{ color: style.color }}
                      >
                        {slot.subject}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Users size={10} /> {slot.class}
                        </p>
                        {slot.room && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin size={10} /> {slot.room}
                          </p>
                        )}
                      </div>
                    </>
                  ) : slot?.type === "meeting" ? (
                    <>
                      <p
                        className="font-bold text-sm"
                        style={{ color: "var(--warning)" }}
                      >
                        {slot.class}
                      </p>
                      {slot.room && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {slot.room}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-gray-400">
                      {isBreak ? period.label : "Free Period"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
