// src/teacher/attendance/TeacherAttendance.tsx
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { classesApi } from "../../api/domains";
import { studentsApi } from "../../api/students";
import { attendanceApi } from "../../api/attendance";
import { Avatar, PageHeader } from "../components/TeacherUI";
import {
  surnameFirst,
  sortStudents,
  useStudentSort,
  SortToggle,
} from "../../utils/studentOrder";

const STATUS_STYLES = {
  present: {
    btn: "border-green-300 bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "Present",
  },
  absent: {
    btn: "border-red-300 bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Absent",
  },
  late: {
    btn: "border-yellow-300 bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
    label: "Late",
  },
};

const TeacherAttendance = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [sortMode, setSortMode] = useStudentSort();
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cls = (await classesApi.list()).filter(
          (c) => c.teaching || c.form,
        );
        setClasses(cls);
        if (cls.length) setSelectedClass(cls[0]);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    let active = true;
    (async () => {
      try {
        // Existing marks are matched by student so a re-save updates them.
        const [studs, records] = await Promise.all([
          studentsApi.list(selectedClass.name),
          attendanceApi.list({ date }),
        ]);
        if (!active) return;
        const inClass = studs.map((s) => ({
          id: s.id,
          studentId: s.studentId,
          firstName: s.firstName,
          lastName: s.lastName,
          name: surnameFirst(s),
        }));
        const statusMap: Record<string, string> = {};
        const idMap: Record<string, string> = {};
        records.forEach((r) => {
          const sid = typeof r.student === "object" ? r.student._id : r.student;
          statusMap[sid] = r.status;
          if (r.id) idMap[sid] = r.id;
        });
        inClass.forEach((s) => {
          if (!statusMap[s.id]) statusMap[s.id] = "present";
        });
        setStudents(inClass);
        setAttendance(statusMap);
        setRecordIds(idMap);
      } catch {
        if (active) {
          setStudents([]);
          setAttendance({});
          setRecordIds({});
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedClass, date]);

  const setAll = (status) =>
    setAttendance((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s.id] = status;
      });
      return next;
    });

  const handleSubmit = async () => {
    if (!selectedClass || students.length === 0) return;
    try {
      setSaving(true);
      const results = await Promise.all(
        students.map((s) => {
          const status = attendance[s.id] || "present";
          const recId = recordIds[s.id];
          return recId
            ? attendanceApi.update(recId, { status })
            : attendanceApi.create({
                student: s.id,
                date,
                status,
                formClass: selectedClass.name,
              });
        }),
      );
      const idMap: Record<string, string> = { ...recordIds };
      results.forEach((r) => {
        const sid = typeof r.student === "object" ? r.student._id : r.student;
        if (r.id) idMap[sid] = r.id;
      });
      setRecordIds(idMap);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    present: students.filter((s) => attendance[s.id] === "present").length,
    absent: students.filter((s) => attendance[s.id] === "absent").length,
    late: students.filter((s) => attendance[s.id] === "late").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Mark Attendance" />

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Class
          </label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={selectedClass?.id || ""}
            onChange={(e) =>
              setSelectedClass(classes.find((c) => c.id === e.target.value))
            }
          >
            {classes.length === 0 && <option>No classes yet</option>}
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setAll("present")}
            className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            All Present
          </button>
          <button
            onClick={() => setAll("absent")}
            className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {["present", "absent", "late"].map((s) => (
          <div
            key={s}
            className={`rounded-xl p-3 text-center border ${STATUS_STYLES[s].btn}`}
          >
            <p className="text-2xl font-bold">{counts[s]}</p>
            <p className="text-xs font-medium capitalize">{s}</p>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-700">
            {selectedClass?.name || "-"} - {students.length} students
          </p>
          <SortToggle mode={sortMode} onChange={setSortMode} />
        </div>

        {students.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            {loading
              ? "Loading…"
              : classes.length === 0
                ? "No classes yet - an admin needs to create classes."
                : "No students in this class yet."}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortStudents(students, sortMode).map((student, idx) => {
              const status = attendance[student.id];
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition"
                >
                  <span className="text-xs text-gray-400 w-5 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <Avatar name={student.name} size="sm" color="bg-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono hidden sm:block">
                      {student.studentId}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {["present", "absent", "late"].map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.id]: s,
                          }))
                        }
                        className={`px-2 sm:px-2.5 py-1 text-xs rounded-lg border font-medium transition ${status === s ? STATUS_STYLES[s].btn : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}
                      >
                        <span className="hidden sm:inline">
                          {STATUS_STYLES[s].label}
                        </span>
                        <span className="sm:hidden">
                          {STATUS_STYLES[s].label[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="px-5 py-3 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={saving || students.length === 0}
            className="flex items-center gap-1.5 px-5 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium disabled:opacity-50"
          >
            <Save size={13} />{" "}
            {saving ? "Saving…" : saved ? "Saved!" : "Submit Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
