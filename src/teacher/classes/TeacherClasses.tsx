// src/teacher/classes/TeacherClasses.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, ClipboardList } from "lucide-react";
import { classesApi } from "../../api/domains";
import { PageHeader } from "../components/TeacherUI";

const TeacherClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classesApi
      .list()
      .then(setClasses)
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="My Classes & Subjects" />

      {loading ? (
        <p className="text-sm text-gray-400 py-10 text-center">
          Loading classes…
        </p>
      ) : classes.length === 0 ? (
        <p className="text-sm text-gray-400 py-10 text-center">
          No classes yet — an admin needs to create classes first.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="h-1.5 bg-[var(--royal-blue)]" />
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {cls.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {cls.course || cls.yearGroup || "—"}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-900 font-bold text-lg">
                      {cls.enrolled ?? 0}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Students</p>
                    <p className="font-bold text-gray-800">
                      {cls.enrolled ?? 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Year Group</p>
                    <p className="font-bold text-gray-800">
                      {cls.yearGroup || "—"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Capacity</p>
                    <p className="font-bold text-gray-800">
                      {cls.capacity ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/teacher/scores")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm bg-[var(--royal-blue)] text-white rounded-lg hover:bg-blue-800 transition"
                  >
                    <Edit3 size={13} /> Enter Scores
                  </button>
                  <button
                    onClick={() => navigate("/teacher/attendance")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                  >
                    <ClipboardList size={13} /> Attendance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
