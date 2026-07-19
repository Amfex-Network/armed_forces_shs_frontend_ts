// src/teacher/hod/TeacherHODPanel.jsx
import React from "react";
import { Building2, Award } from "lucide-react";
import { DEPT_TEACHERS } from "../data/teacherData";
import { Avatar, LoadBar, PageHeader } from "../components/TeacherUI";

const TeacherHODPanel = () => {
  const avgLoad = Math.round(
    DEPT_TEACHERS.reduce((s, t) => s + t.load, 0) / DEPT_TEACHERS.length,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Award size={16} className="text-purple-700" />
        </div>
        <PageHeader title="HOD Panel — Science Department" />
      </div>

      {/* Dept Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Dept Teachers",
            value: DEPT_TEACHERS.length,
            color: "bg-purple-600",
          },
          { label: "Dept Classes", value: 14, color: "bg-blue-600" },
          { label: "Dept Students", value: 524, color: "bg-green-600" },
          { label: "Avg Load", value: `${avgLoad}%`, color: "bg-orange-500" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"
          >
            <div
              className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}
            >
              <Building2 size={18} className="text-white" />
            </div>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Teacher Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 text-sm">
            Department Teachers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Teacher
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Classes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Load
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEPT_TEACHERS.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={t.name}
                        size="sm"
                        color={i === 0 ? "bg-purple-700" : "bg-blue-600"}
                      />
                      <div>
                        <p className="font-medium text-gray-800">{t.name}</p>
                        {i === 0 && (
                          <span className="text-xs text-purple-600 font-semibold">
                            HOD
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {t.subject}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-800">
                    {t.classes}
                  </td>
                  <td className="px-4 py-3 min-w-[140px]">
                    <LoadBar pct={t.load} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                      Active
                    </span>
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

export default TeacherHODPanel;
