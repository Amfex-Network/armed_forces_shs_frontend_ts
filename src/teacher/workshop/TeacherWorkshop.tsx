// src/teacher/workshop/TeacherWorkshop.jsx
import React, { useState } from "react";
import { Wrench, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import { WORKSHOP_DATA } from "../data/teacherData";
import { PageHeader } from "../components/TeacherUI";

const TeacherWorkshop = () => {
  const [activeTab, setActiveTab] = useState("equipment");
  const wd = WORKSHOP_DATA;

  const faulty = wd.equipment.reduce((s, e) => s + e.faulty, 0);
  const functional = wd.equipment.reduce((s, e) => s + e.functional, 0);

  const tabs = [
    { id: "equipment", label: "Equipment" },
    { id: "schedule", label: "Schedule" },
    { id: "incidents", label: `Incidents (${wd.incidents.length})` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#fffbeb" }}
        >
          <Wrench size={16} style={{ color: "var(--warning)" }} />
        </div>
        <PageHeader title={`Workshop Supervisor — ${wd.workshopName}`} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Capacity",
            value: `${wd.capacity} students`,
            color: "var(--royal-blue)",
          },
          {
            label: "Functional",
            value: functional,
            color: "var(--success-dark)",
          },
          {
            label: "Faulty Items",
            value: faulty,
            color: faulty > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            label: "Weekly Slots",
            value: wd.schedule.length,
            color: "var(--info)",
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

      {faulty > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{
            backgroundColor: "#fff1f2",
            borderColor: "var(--accent-red-light)",
            color: "var(--accent-red-dark)",
          }}
        >
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>
              {faulty} equipment item{faulty > 1 ? "s" : ""}
            </strong>{" "}
            require{faulty === 1 ? "s" : ""} maintenance. Report to the
            Technical HOD.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors"
            style={{
              borderColor:
                activeTab === t.id ? "var(--warning)" : "transparent",
              color: activeTab === t.id ? "var(--warning)" : "var(--dark-gray)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Equipment */}
      {activeTab === "equipment" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead
                className="border-b"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <tr>
                  {[
                    "Equipment",
                    "Total",
                    "Functional",
                    "Faulty",
                    "Condition",
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
                {wd.equipment.map((eq, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {eq.name}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {eq.total}
                    </td>
                    <td
                      className="px-4 py-3 text-center font-semibold"
                      style={{ color: "var(--success-dark)" }}
                    >
                      {eq.functional}
                    </td>
                    <td
                      className="px-4 py-3 text-center font-semibold"
                      style={{
                        color:
                          eq.faulty > 0
                            ? "var(--accent-red)"
                            : "var(--success-dark)",
                      }}
                    >
                      {eq.faulty}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            eq.faulty === 0 ? "#f0fdf4" : "#fff1f2",
                          color:
                            eq.faulty === 0
                              ? "var(--success-dark)"
                              : "var(--accent-red)",
                        }}
                      >
                        {eq.faulty === 0 ? "✓ Good" : "⚠ Needs repair"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule */}
      {activeTab === "schedule" && (
        <div className="space-y-3">
          {wd.schedule.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "var(--warning)" }}
              >
                {s.day.slice(0, 3)}
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {s.class}
                </p>
                <p className="text-xs text-gray-500">{s.activity}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {s.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Incidents */}
      {activeTab === "incidents" && (
        <div className="space-y-3">
          {wd.incidents.map((inc, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border shadow-sm p-4"
              style={{
                borderColor: "var(--medium-gray)",
                borderLeft: `4px solid var(--accent-red)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent-red)" }}
                  >
                    {inc.type}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {inc.description}
                  </p>
                  <p
                    className="text-xs mt-1 font-medium"
                    style={{ color: "var(--success-dark)" }}
                  >
                    Action taken: {inc.action}
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(inc.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherWorkshop;
