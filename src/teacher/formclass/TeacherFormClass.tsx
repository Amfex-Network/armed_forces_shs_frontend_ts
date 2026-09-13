import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, CheckCircle2 } from "lucide-react";
import { studentsApi, type Student } from "../../api/students";
import { Avatar, PageHeader } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

const TeacherFormClass = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const formClass = user?.formClass;

  useEffect(() => {
    studentsApi
      .list()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const roster = useMemo(
    () => students.filter((s) => formClass && s.formClass === formClass),
    [students, formClass],
  );

  const active = roster.filter((s) => (s.status || "Active") === "Active").length;

  if (loading)
    return <div className="py-20 text-center text-sm text-gray-400">Loading…</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#eef2ff" }}
        >
          <Users size={16} style={{ color: "var(--royal-blue)" }} />
        </div>
        <PageHeader title={`Form Class - ${formClass || "My Form Class"}`} />
      </div>

      {!formClass ? (
        <div
          className="bg-white rounded-xl border shadow-sm py-16 text-center"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <Users size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-400">
            You are not assigned to a form class. Ask the admin to set your form
            class on your staff profile.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Class Size", value: roster.length, color: "var(--royal-blue)", icon: Users },
              { label: "Active", value: active, color: "var(--success-dark)", icon: CheckCircle2 },
            ].map(({ label, value, color, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "18" }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
                    {value}
                  </p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/teacher/reports"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition w-fit"
            style={{ borderColor: "var(--royal-blue)", color: "var(--royal-blue)", backgroundColor: "#eef2ff" }}
          >
            <FileText size={14} /> Open Report Cards for full results
          </Link>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--medium-gray)" }}>
            <div className="px-5 py-3.5 border-b" style={{ backgroundColor: "var(--light-gray)", borderColor: "var(--medium-gray)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--dark-gray)" }}>
                Student Roster - {formClass}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="border-b" style={{ backgroundColor: "var(--light-gray)", borderColor: "var(--medium-gray)" }}>
                  <tr>
                    {["#", "Student", "Student ID", "Gender", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
                  {roster.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                        No students assigned to this class yet.
                      </td>
                    </tr>
                  ) : (
                    roster.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" color="bg-blue-700" />
                            <p className="font-medium" style={{ color: "var(--dark-gray)" }}>
                              {s.firstName} {s.lastName}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.studentId}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{s.gender || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: (s.status || "Active") === "Active" ? "#f0fdf4" : "#fff1f2",
                              color: (s.status || "Active") === "Active" ? "var(--success-dark)" : "var(--accent-red)",
                            }}
                          >
                            {s.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherFormClass;
