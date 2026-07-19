// src/teacher/dashboards/DashHouseMaster.jsx
import React from "react";
import {
  Home,
  Users,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Activity,
} from "lucide-react";
import { HOUSE_DATA } from "../data/teacherData";
import {
  WelcomeBanner,
  StatRow,
  SectionCard,
  NotificationsStrip,
  TrackSchedule,
  QuickActions,
} from "./DashboardShell";
import { Avatar } from "../components/TeacherUI";

const FEE_STYLE = {
  paid: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Paid" },
  pending: { bg: "#fffbeb", color: "var(--warning)", label: "Pending" },
  overdue: { bg: "#fff1f2", color: "var(--accent-red)", label: "Overdue" },
};
const STATUS_STYLE = {
  present: { color: "var(--success-dark)", label: "Present" },
  absent: { color: "var(--accent-red)", label: "Absent" },
  sick: { color: "var(--warning)", label: "Sick Bay" },
};

const DashHouseMaster = () => {
  const hd = HOUSE_DATA;
  const present = hd.students.filter((s) => s.status === "present").length;
  const absent = hd.students.filter((s) => s.status === "absent").length;
  const feeDue = hd.students.filter((s) => s.fees !== "paid").length;

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="House Master / Mistress"
        subtitle={`${hd.houseName} · ${hd.totalStudents} students · ${hd.rooms} rooms`}
        accentColor="var(--accent-red)"
      />

      <StatRow
        stats={[
          {
            icon: Users,
            label: "Total Students",
            value: hd.totalStudents,
            sub: `${hd.boys} boys · ${hd.girls} girls`,
            color: "var(--accent-red)",
          },
          {
            icon: CheckCircle2,
            label: "Present Today",
            value: present,
            sub: "in house",
            color: "var(--success-dark)",
          },
          {
            icon: AlertCircle,
            label: "Absent Today",
            value: absent,
            sub: absent > 0 ? "follow up" : "all good",
            color: absent > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: DollarSign,
            label: "Fees Overdue",
            value: feeDue,
            sub: feeDue > 0 ? "action needed" : "all paid",
            color: feeDue > 0 ? "var(--warning)" : "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "House Panel",
            icon: Home,
            path: "/teacher/house",
            color: "var(--accent-red)",
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
        {/* Students */}
        <SectionCard
          title={`${hd.houseName} — Students`}
          icon={Users}
          accentColor="var(--accent-red)"
          linkTo="/teacher/house"
        >
          <div className="space-y-2">
            {hd.students.map((s) => {
              const ss = STATUS_STYLE[s.status];
              const fs = FEE_STYLE[s.fees];
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ backgroundColor: "var(--light-gray)" }}
                >
                  <Avatar name={s.name} size="sm" color="bg-red-600" />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.class} · Room {s.room}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ color: ss.color }}
                  >
                    {ss.label}
                  </span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: fs.bg, color: fs.color }}
                  >
                    {fs.label}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-5">
          {/* Incidents */}
          <SectionCard
            title="Recent Incidents"
            icon={AlertCircle}
            accentColor="var(--warning)"
            linkTo="/teacher/house"
          >
            {hd.incidents.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No incidents recorded
              </p>
            ) : (
              hd.incidents.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 mb-3">
                  <AlertCircle
                    size={13}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent-red)" }}
                  />
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {inc.student} —{" "}
                      <span style={{ color: "var(--accent-red)" }}>
                        {inc.type}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">{inc.action}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(inc.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </SectionCard>
          <NotificationsStrip />
        </div>
      </div>

      <TrackSchedule />
    </div>
  );
};

export default DashHouseMaster;
