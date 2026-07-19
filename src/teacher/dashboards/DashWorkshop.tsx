// src/teacher/dashboards/DashWorkshop.jsx
import React from "react";
import {
  Wrench,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Activity,
} from "lucide-react";
import { WORKSHOP_DATA } from "../data/teacherData";
import {
  WelcomeBanner,
  StatRow,
  SectionCard,
  NotificationsStrip,
  TrackSchedule,
  QuickActions,
} from "./DashboardShell";

export const DashWorkshop = () => {
  const wd = WORKSHOP_DATA;
  const faulty = wd.equipment.reduce((s, e) => s + e.faulty, 0);
  const functional = wd.equipment.reduce((s, e) => s + e.functional, 0);

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Workshop Supervisor"
        subtitle={`${wd.workshopName} · Capacity: ${wd.capacity} students`}
        accentColor="#92400e"
      />

      <StatRow
        stats={[
          {
            icon: Wrench,
            label: "Workshop Capacity",
            value: `${wd.capacity}`,
            sub: "students max",
            color: "#92400e",
          },
          {
            icon: CheckCircle2,
            label: "Functional Items",
            value: functional,
            sub: "ready to use",
            color: "var(--success-dark)",
          },
          {
            icon: AlertCircle,
            label: "Faulty Items",
            value: faulty,
            sub: faulty > 0 ? "need repair" : "all good",
            color: faulty > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: Calendar,
            label: "Weekly Slots",
            value: wd.schedule.length,
            sub: "classes scheduled",
            color: "var(--royal-blue)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Workshop",
            icon: Wrench,
            path: "/teacher/workshop",
            color: "#92400e",
          },
          {
            label: "Score Entry",
            icon: Activity,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Attendance",
            icon: CheckCircle2,
            path: "/teacher/attendance",
            color: "var(--success-dark)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Equipment Status"
          icon={Wrench}
          accentColor="#92400e"
          linkTo="/teacher/workshop"
        >
          <div className="space-y-2">
            {wd.equipment.map((eq, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{ backgroundColor: "var(--light-gray)" }}
              >
                <div className="flex-1">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {eq.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Total: {eq.total} · Functional: {eq.functional}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: eq.faulty === 0 ? "#f0fdf4" : "#fff1f2",
                    color:
                      eq.faulty === 0
                        ? "var(--success-dark)"
                        : "var(--accent-red)",
                  }}
                >
                  {eq.faulty === 0 ? "✓ OK" : `⚠ ${eq.faulty} faulty`}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title="This Week's Schedule"
            icon={Calendar}
            accentColor="var(--warning)"
            linkTo="/teacher/workshop"
          >
            {wd.schedule.map((s, i) => (
              <div key={i} className="flex items-center gap-3 mb-2.5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "var(--warning)" }}
                >
                  {s.day.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {s.class}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.activity} · {s.time}
                  </p>
                </div>
              </div>
            ))}
          </SectionCard>
          <NotificationsStrip />
        </div>
      </div>
      <TrackSchedule />
    </div>
  );
};

// ─── Sports Dashboard ─────────────────────────────────────────────────────────
import { Trophy, Users, Star } from "lucide-react";
import { SPORTS_DATA } from "../data/teacherData";

export const DashSports = () => {
  const sd = SPORTS_DATA;
  const totalAthletes = sd.teams.reduce((s, t) => s + t.members, 0);

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Sports Master / Mistress"
        subtitle={`${sd.teams.length} teams · ${totalAthletes} athletes`}
        accentColor="#0369a1"
      />

      <StatRow
        stats={[
          {
            icon: Trophy,
            label: "Teams",
            value: sd.teams.length,
            sub: "active squads",
            color: "#0369a1",
          },
          {
            icon: Users,
            label: "Total Athletes",
            value: totalAthletes,
            sub: "enrolled",
            color: "var(--success-dark)",
          },
          {
            icon: Calendar,
            label: "Upcoming Events",
            value: sd.upcomingEvents.length,
            sub: "this term",
            color: "var(--warning)",
          },
          {
            icon: Star,
            label: "External Events",
            value: sd.upcomingEvents.filter((e) => e.type === "External")
              .length,
            sub: "inter-school",
            color: "var(--accent-red)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Sports Panel",
            icon: Trophy,
            path: "/teacher/sports",
            color: "#0369a1",
          },
          {
            label: "Score Entry",
            icon: Activity,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Analytics",
            icon: Star,
            path: "/teacher/analytics",
            color: "var(--info)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Teams"
          icon={Trophy}
          accentColor="#0369a1"
          linkTo="/teacher/sports"
        >
          {sd.teams.map((team, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-lg mb-2"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "#0369a1" }}
              >
                {team.members}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {team.name}
                </p>
                <p className="text-xs text-gray-400">
                  Coach: {team.coach} · Record: {team.record}
                </p>
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

        <div className="space-y-5">
          <SectionCard
            title="Upcoming Events"
            icon={Calendar}
            accentColor="var(--warning)"
            linkTo="/teacher/sports"
          >
            {sd.upcomingEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor:
                      ev.type === "External"
                        ? "var(--accent-red)"
                        : "var(--royal-blue)",
                  }}
                >
                  {new Date(ev.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {ev.event}
                  </p>
                  <p className="text-xs text-gray-400">{ev.venue}</p>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-semibold"
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
          </SectionCard>
          <NotificationsStrip />
        </div>
      </div>
      <TrackSchedule />
    </div>
  );
};

// ─── Counsellor Dashboard ─────────────────────────────────────────────────────
import { Heart } from "lucide-react";
import { COUNSELLOR_DATA } from "../data/teacherData";

export const DashCounsellor = () => {
  const cd = COUNSELLOR_DATA;
  const ongoing = cd.cases.filter((c) => c.status === "ongoing").length;
  const resolved = cd.cases.filter((c) => c.status === "resolved").length;
  const high = cd.cases.filter(
    (c) => c.priority === "high" && c.status === "ongoing",
  ).length;

  const PRIORITY_STYLE = {
    high: { bg: "#fff1f2", color: "var(--accent-red)", label: "High" },
    medium: { bg: "#fffbeb", color: "var(--warning)", label: "Medium" },
    low: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Low" },
  };
  const STATUS_STYLE_C = {
    ongoing: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Ongoing" },
    resolved: {
      bg: "#f0fdf4",
      color: "var(--success-dark)",
      label: "Resolved",
    },
    referred: { bg: "#fffbeb", color: "var(--warning)", label: "Referred" },
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Guidance Counsellor"
        subtitle={`${cd.totalSessions} sessions completed · ${cd.pendingFollowUps} follow-ups pending`}
        accentColor="var(--success-dark)"
      />

      <StatRow
        stats={[
          {
            icon: Heart,
            label: "Total Cases",
            value: cd.cases.length,
            sub: "all cases",
            color: "var(--royal-blue)",
          },
          {
            icon: AlertCircle,
            label: "Ongoing",
            value: ongoing,
            sub: "active sessions",
            color: "var(--warning)",
          },
          {
            icon: CheckCircle2,
            label: "Resolved",
            value: resolved,
            sub: "closed cases",
            color: "var(--success-dark)",
          },
          {
            icon: Activity,
            label: "High Priority",
            value: high,
            sub: high > 0 ? "urgent" : "none urgent",
            color: high > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Counselling",
            icon: Heart,
            path: "/teacher/counsellor",
            color: "var(--success-dark)",
          },
          {
            label: "Score Entry",
            icon: Activity,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Attendance",
            icon: CheckCircle2,
            path: "/teacher/attendance",
            color: "var(--info)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Active Cases"
          icon={Heart}
          accentColor="var(--success-dark)"
          linkTo="/teacher/counsellor"
        >
          {cd.cases
            .filter((c) => c.status !== "resolved")
            .map((c) => {
              const ps = PRIORITY_STYLE[c.priority];
              const ss = STATUS_STYLE_C[c.status];
              return (
                <div
                  key={c.id}
                  className="mb-3 p-3 rounded-xl border-l-4"
                  style={{
                    borderColor: ps.color,
                    backgroundColor: "var(--light-gray)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className="text-xs font-bold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {c.studentName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {c.class} · {c.issue}
                      </p>
                      <p className="text-xs text-gray-400">
                        {c.sessions} session{c.sessions > 1 ? "s" : ""}{" "}
                        completed
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-semibold"
                        style={{ backgroundColor: ss.bg, color: ss.color }}
                      >
                        {ss.label}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-semibold"
                        style={{ backgroundColor: ps.bg, color: ps.color }}
                      >
                        {ps.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title="Upcoming Appointments"
            icon={Calendar}
            accentColor="var(--info)"
            linkTo="/teacher/counsellor"
          >
            {cd.appointments.map((a, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  <span className="text-xs font-bold">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-xs">{a.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {a.student}
                  </p>
                  <p className="text-xs text-gray-400">{a.type}</p>
                </div>
              </div>
            ))}
          </SectionCard>
          <NotificationsStrip />
        </div>
      </div>
      <TrackSchedule />
    </div>
  );
};

export default DashWorkshop;
