// src/teacher/waec/TeacherWAEC.jsx
import React from "react";
import { Shield, Calendar, Clock, Users } from "lucide-react";
import { WAEC_DATA } from "../data/teacherData";
import { PageHeader } from "../components/TeacherUI";

const TeacherWAEC = () => {
  const wd = WAEC_DATA;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#fff1f2" }}
        >
          <Shield size={16} style={{ color: "var(--accent-red)" }} />
        </div>
        <PageHeader title="WAEC Supervisor Panel" />
      </div>

      {/* WASSCE banner */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--accent-red-dark), var(--accent-red))`,
        }}
      >
        <div className="absolute right-4 top-4 opacity-10">
          <Shield size={80} />
        </div>
        <p className="text-red-200 text-xs mb-1">
          West African Examinations Council
        </p>
        <h2 className="font-black text-lg leading-tight">{wd.examTitle}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span>📅 {wd.examYear}</span>
          <span>🎓 {wd.candidates} candidates</span>
          <span>🏛 {wd.examCentre}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "WASSCE Candidates",
            value: wd.candidates,
            color: "var(--royal-blue)",
          },
          {
            label: "Subjects Scheduled",
            value: wd.subjects.length,
            color: "var(--info)",
          },
          {
            label: "My Duties",
            value: wd.invigilationDuties.length,
            color: "var(--accent-red)",
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

      {/* My invigilation duties */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="px-5 py-3.5 border-b"
          style={{
            backgroundColor: "var(--light-gray)",
            borderColor: "var(--medium-gray)",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--dark-gray)" }}
          >
            My Invigilation Duties
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
          {wd.invigilationDuties.map((d, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <div
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                style={{ backgroundColor: "var(--accent-red)" }}
              >
                <span className="text-xs font-bold">
                  {new Date(d.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="text-xs">{d.time}</span>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {d.subject}
                </p>
                <p className="text-xs text-gray-400">Venue: {d.venue}</p>
              </div>
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                style={{
                  backgroundColor:
                    d.role === "Chief Invigilator" ? "#fff1f2" : "#eef2ff",
                  color:
                    d.role === "Chief Invigilator"
                      ? "var(--accent-red)"
                      : "var(--royal-blue)",
                }}
              >
                {d.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full exam schedule */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="px-5 py-3.5 border-b"
          style={{
            backgroundColor: "var(--light-gray)",
            borderColor: "var(--medium-gray)",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--dark-gray)" }}
          >
            Full WASSCE Schedule
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {[
                  "Subject",
                  "Code",
                  "Paper",
                  "Date",
                  "Time",
                  "Venue",
                  "Invigilators",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500"
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
              {wd.subjects.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {s.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {s.code}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.paper}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(s.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.time}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.venue}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {s.invigilators.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherWAEC;
