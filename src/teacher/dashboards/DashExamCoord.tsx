// src/teacher/dashboards/DashExamCoord.jsx
import React from "react";
import {
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  ClipboardList,
  Activity,
  BookOpen,
  Award,
  Users,
  Trophy,
} from "lucide-react";
import {
  EXAM_DATA,
  DEPT_TEACHERS,
  CLASSES_DATA,
  FORM_CLASS_STUDENTS,
  SPORTS_DATA,
} from "../data/teacherData";
import {
  WelcomeBanner,
  StatRow,
  SectionCard,
  MiniStats,
  MyClassesStrip,
  NotificationsStrip,
  TrackSchedule,
  QuickActions,
} from "./DashboardShell";
import { Avatar, LoadBar } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

// ─── Exam Coordinator Dashboard ───────────────────────────────────────────────
export const DashExamCoord = () => {
  const ed = EXAM_DATA;
  const daysToExam = Math.max(
    0,
    Math.ceil((new Date(ed.startDate) - new Date()) / 86400000),
  );

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Exam Coordinator"
        subtitle={`${ed.currentExam} · ${ed.totalSubjects} subjects`}
        accentColor="var(--warning)"
      />

      <StatRow
        stats={[
          {
            icon: Calendar,
            label: "Days to Exam",
            value: daysToExam,
            sub: ed.currentExam.slice(0, 20) + "…",
            color: "var(--warning)",
          },
          {
            icon: ClipboardList,
            label: "Subjects",
            value: ed.totalSubjects,
            sub: "scheduled",
            color: "var(--royal-blue)",
          },
          {
            icon: AlertCircle,
            label: "Pending Scores",
            value: ed.pendingScores.length,
            sub: ed.pendingScores.length > 0 ? "chase up" : "all submitted",
            color:
              ed.pendingScores.length > 0
                ? "var(--accent-red)"
                : "var(--success-dark)",
          },
          {
            icon: Activity,
            label: "Total Classes",
            value: ed.totalClasses,
            sub: "involved",
            color: "var(--info)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Exam Panel",
            icon: Calendar,
            path: "/teacher/examcoord",
            color: "var(--warning)",
          },
          {
            label: "Score Entry",
            icon: ClipboardList,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Analytics",
            icon: Activity,
            path: "/teacher/analytics",
            color: "var(--info)",
          },
        ]}
      />

      {/* Countdown */}
      <div
        className="rounded-2xl p-6 text-white text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
        }}
      >
        <p className="text-blue-200 text-sm mb-1">{ed.currentExam}</p>
        <p className="font-black text-6xl">{daysToExam}</p>
        <p className="text-blue-200 mt-1">days remaining</p>
        <div className="flex justify-center gap-8 mt-4 text-sm">
          <span>
            📅 Starts:{" "}
            {new Date(ed.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
            })}
          </span>
          <span>
            📅 Ends:{" "}
            {new Date(ed.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timetable preview */}
        <SectionCard
          title="Exam Timetable"
          icon={Calendar}
          accentColor="var(--warning)"
          linkTo="/teacher/examcoord"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[360px]">
              <thead>
                <tr style={{ backgroundColor: "var(--light-gray)" }}>
                  {["Subject", "Date", "Time", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left font-semibold text-gray-500 uppercase"
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
                {ed.subjects.slice(0, 5).map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td
                      className="px-3 py-2 font-medium"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {s.name}
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {new Date(s.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{s.time}</td>
                    <td className="px-3 py-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        Scheduled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-5">
          {ed.pendingScores.length > 0 && (
            <SectionCard
              title={`Pending Scores (${ed.pendingScores.length})`}
              icon={AlertCircle}
              accentColor="var(--accent-red)"
            >
              {ed.pendingScores.map((p, i) => (
                <div key={i} className="flex items-start gap-2 mb-3">
                  <AlertCircle
                    size={13}
                    style={{ color: "var(--accent-red)" }}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {p.teacher} — {p.subject}
                    </p>
                    <p className="text-xs text-gray-400">{p.class}</p>
                    <p
                      className="text-xs flex items-center gap-1 mt-0.5"
                      style={{ color: "var(--accent-red)" }}
                    >
                      <Clock size={10} /> Deadline:{" "}
                      {new Date(p.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </SectionCard>
          )}
          <NotificationsStrip />
        </div>
      </div>
      <TrackSchedule />
    </div>
  );
};

// ─── HOD + Exam Coordinator Dashboard ────────────────────────────────────────
export const DashHODExamCoord = () => {
  const { user } = useAuth();
  const ed = EXAM_DATA;
  const daysToExam = Math.max(
    0,
    Math.ceil((new Date(ed.startDate) - new Date()) / 86400000),
  );
  const avgLoad = Math.round(
    DEPT_TEACHERS.reduce((s, t) => s + t.load, 0) / DEPT_TEACHERS.length,
  );

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Subject Teacher + HOD + Exam Coordinator"
        subtitle={`${user?.department} HOD · Teaching ${user?.subject} · Managing ${ed.totalSubjects} exam subjects`}
        accentColor="#b45309"
      />

      <StatRow
        stats={[
          {
            icon: Award,
            label: "Dept Teachers",
            value: DEPT_TEACHERS.length,
            sub: `${user?.department} Dept`,
            color: "#7c3aed",
          },
          {
            icon: Activity,
            label: "Dept Avg Load",
            value: `${avgLoad}%`,
            sub: "teaching load",
            color: avgLoad >= 85 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: Calendar,
            label: "Days to Exam",
            value: daysToExam,
            sub: "countdown",
            color: "var(--warning)",
          },
          {
            icon: AlertCircle,
            label: "Pending Scores",
            value: ed.pendingScores.length,
            sub: "need follow-up",
            color:
              ed.pendingScores.length > 0
                ? "var(--accent-red)"
                : "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "HOD Panel",
            icon: Award,
            path: "/teacher/hod",
            color: "#7c3aed",
          },
          {
            label: "Exam Panel",
            icon: Calendar,
            path: "/teacher/examcoord",
            color: "var(--warning)",
          },
          {
            label: "Score Entry",
            icon: ClipboardList,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Analytics",
            icon: Activity,
            path: "/teacher/analytics",
            color: "var(--info)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HOD Section */}
        <SectionCard
          title="Department Overview"
          icon={Award}
          accentColor="#7c3aed"
          linkTo="/teacher/hod"
        >
          <div className="space-y-2">
            {DEPT_TEACHERS.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar
                  name={t.name}
                  size="sm"
                  color={i === 0 ? "bg-purple-700" : "bg-blue-600"}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.subject}</p>
                </div>
                <div className="w-20">
                  <LoadBar pct={t.load} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Exam countdown + pending */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-4 text-center text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
            }}
          >
            <p className="text-blue-200 text-xs mb-1">Exam begins in</p>
            <p className="font-black text-4xl">{daysToExam}</p>
            <p className="text-blue-200 text-xs">
              days · {ed.totalSubjects} subjects
            </p>
          </div>
          {ed.pendingScores.length > 0 && (
            <SectionCard
              title="Pending Scores"
              icon={AlertCircle}
              accentColor="var(--accent-red)"
              linkTo="/teacher/examcoord"
            >
              {ed.pendingScores.map((p, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <AlertCircle
                    size={13}
                    style={{ color: "var(--accent-red)" }}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {p.teacher}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.subject} · {p.class}
                    </p>
                  </div>
                </div>
              ))}
            </SectionCard>
          )}
        </div>
      </div>
      <NotificationsStrip />
      <TrackSchedule />
    </div>
  );
};

// ─── Form Teacher + Sports Master Dashboard ───────────────────────────────────
export const DashFormSports = () => {
  const { user } = useAuth();
  const sd = SPORTS_DATA;
  const totalAthletes = sd.teams.reduce((s, t) => s + t.members, 0);
  const a1s = FORM_CLASS_STUDENTS.filter((s) => s.grade === "A1").length;
  const avgAtt = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.attendance, 0) /
      FORM_CLASS_STUDENTS.length,
  );
  const atRisk = FORM_CLASS_STUDENTS.filter(
    (s) => s.attendance < 85 || ["D7", "E8", "F9"].includes(s.grade),
  );

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Subject Teacher + Form Teacher + Sports Master"
        subtitle={`Teaching ${user?.subject} · Form Class: ${user?.formClass || "Form 3B"} · ${sd.teams.length} sports teams`}
        accentColor="#0369a1"
      />

      <StatRow
        stats={[
          {
            icon: Users,
            label: "Form Class",
            value: FORM_CLASS_STUDENTS.length,
            sub: user?.formClass || "Form 3B",
            color: "var(--info)",
          },
          {
            icon: Activity,
            label: "A1 Grades",
            value: a1s,
            sub: `Avg att: ${avgAtt}%`,
            color: "var(--success-dark)",
          },
          {
            icon: Trophy,
            label: "Sports Teams",
            value: sd.teams.length,
            sub: `${totalAthletes} athletes`,
            color: "#0369a1",
          },
          {
            icon: Calendar,
            label: "Next Fixture",
            value: sd.upcomingEvents.length,
            sub: "upcoming events",
            color: "var(--warning)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Form Class",
            icon: Users,
            path: "/teacher/formclass",
            color: "var(--info)",
          },
          {
            label: "Sports",
            icon: Trophy,
            path: "/teacher/sports",
            color: "#0369a1",
          },
          {
            label: "Score Entry",
            icon: ClipboardList,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Attendance",
            icon: Activity,
            path: "/teacher/attendance",
            color: "var(--success-dark)",
          },
          {
            label: "Comments",
            icon: BookOpen,
            path: "/teacher/comments",
            color: "var(--warning)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form class */}
        <SectionCard
          title={`Form Class — ${user?.formClass || "Form 3B"}`}
          icon={Users}
          accentColor="var(--info)"
          linkTo="/teacher/formclass"
        >
          <MiniStats
            items={[
              {
                label: "Students",
                value: FORM_CLASS_STUDENTS.length,
                color: "var(--royal-blue)",
              },
              { label: "A1 Grades", value: a1s, color: "var(--success-dark)" },
              {
                label: "Avg Att",
                value: `${avgAtt}%`,
                color: "var(--warning)",
              },
            ]}
          />
          {atRisk.length > 0 && (
            <div
              className="mt-3 p-2 rounded-lg"
              style={{ backgroundColor: "#fff1f2" }}
            >
              <p
                className="text-xs font-bold"
                style={{ color: "var(--accent-red)" }}
              >
                ⚠ {atRisk.length} students need attention
              </p>
            </div>
          )}
        </SectionCard>

        {/* Sports */}
        <SectionCard
          title="Sports Teams"
          icon={Trophy}
          accentColor="#0369a1"
          linkTo="/teacher/sports"
        >
          {sd.teams.map((team, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg mb-2"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "#0369a1" }}
              >
                {team.members}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {team.name}
                </p>
                <p className="text-xs text-gray-400">{team.record}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {new Date(team.nextMatch).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          ))}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyClassesStrip />
        <NotificationsStrip />
      </div>
      <TrackSchedule />
    </div>
  );
};

export default DashExamCoord;
