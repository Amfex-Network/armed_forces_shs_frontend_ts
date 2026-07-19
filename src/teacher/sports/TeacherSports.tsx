// src/teacher/sports/TeacherSports.jsx
import React from "react";
import { Trophy, Calendar, Users } from "lucide-react";
import { SPORTS_DATA } from "../data/teacherData";
import { PageHeader } from "../components/TeacherUI";

const TeacherSports = () => {
  const sd = SPORTS_DATA;
  const totalAthletes = sd.teams.reduce((s, t) => s + t.members, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#fffbeb" }}
        >
          <Trophy size={16} style={{ color: "var(--warning)" }} />
        </div>
        <PageHeader title="Sports Master Panel" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Teams",
            value: sd.teams.length,
            color: "var(--royal-blue)",
          },
          {
            label: "Total Athletes",
            value: totalAthletes,
            color: "var(--success-dark)",
          },
          {
            label: "Upcoming Events",
            value: sd.upcomingEvents.length,
            color: "var(--warning)",
          },
          {
            label: "External Events",
            value: sd.upcomingEvents.filter((e) => e.type === "External")
              .length,
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

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sd.teams.map((team, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border shadow-sm p-4 overflow-hidden relative"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 bg-yellow-500"
              style={{ transform: "translate(30%,-30%)" }}
            />
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className="font-bold text-base"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {team.name}
                </p>
                <p className="text-xs text-gray-400">
                  {team.sport} · Coach: {team.coach}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "var(--warning)" }}
              >
                {team.members}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar size={11} />
                Next:{" "}
                {new Date(team.nextMatch).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span
                className="font-mono font-semibold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--light-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                {team.record}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
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
            Upcoming Events
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
          {sd.upcomingEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <div
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                style={{
                  backgroundColor:
                    ev.type === "External"
                      ? "var(--accent-red)"
                      : "var(--royal-blue)",
                }}
              >
                <span className="text-xs font-bold">
                  {new Date(ev.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {ev.event}
                </p>
                <p className="text-xs text-gray-400">{ev.venue}</p>
              </div>
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                style={{
                  backgroundColor:
                    ev.type === "External" ? "#fff1f2" : "#eef2ff",
                  color:
                    ev.type === "External"
                      ? "var(--accent-red)"
                      : "var(--royal-blue)",
                }}
              >
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherSports;
