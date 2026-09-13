import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { classesApi, subjectsApi } from "../../api/domains";
import { studentsApi, type Student } from "../../api/students";
import { scoresApi } from "../../api/scores";
import { useSettings } from "../../context/SettingsContext";

const GRADE_COLOR: Record<string, string> = {
  A1: "text-green-700 bg-green-50",
  B2: "text-blue-700 bg-blue-50",
  B3: "text-blue-600 bg-blue-50",
  C4: "text-yellow-700 bg-yellow-50",
  C5: "text-orange-600 bg-orange-50",
  C6: "text-orange-700 bg-orange-50",
  D7: "text-red-500 bg-red-50",
  E8: "text-red-600 bg-red-50",
  F9: "text-red-700 bg-red-50",
};

const CREDIT = ["A1", "B2", "B3", "C4", "C5", "C6"];

interface Row {
  studentId: string;
  name: string;
  ca: number | null;
  exam: number | null;
  total: number | null;
  grade: string | null;
}

const ScoreReview = () => {
  const { settings } = useSettings();
  const TERMS = settings.terms;
  const ACADEMIC_YEAR = settings.currentAcademicYear;

  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState(settings.currentTerm);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    (async () => {
      try {
        const [cls, subs] = await Promise.all([
          classesApi.list(),
          subjectsApi.list(),
        ]);
        setClasses(cls);
        setSubjects(subs);
        if (cls.length) setSelectedClass(cls[0]);
        if (subs.length) setSubject(subs[0].name);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedClass || !subject) {
      setRows([]);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const [studs, scores] = await Promise.all([
          studentsApi.list(),
          scoresApi.list({
            subject,
            term,
            academicYear: ACADEMIC_YEAR,
            formClass: selectedClass.name,
          }),
        ]);
        if (!alive) return;
        const byStudent: Record<string, any> = {};
        scores.forEach((sc: any) => {
          const sid =
            typeof sc.student === "object" ? sc.student._id : sc.student;
          byStudent[sid] = sc;
        });
        setRows(
          studs
            .filter((s: Student) => s.formClass === selectedClass.name)
            .map((s: Student) => {
              const sc = byStudent[s.id as string];
              return {
                studentId: s.studentId,
                name: `${s.firstName} ${s.lastName}`,
                ca: sc ? sc.classScore : null,
                exam: sc ? sc.examScore : null,
                total: sc ? sc.total : null,
                grade: sc ? sc.grade : null,
              };
            }),
        );
      } catch {
        if (alive) setRows([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedClass, subject, term, ACADEMIC_YEAR]);

  const stats = useMemo(() => {
    const entered = rows.filter((r) => r.total !== null);
    const avg =
      entered.length > 0
        ? Math.round(
            entered.reduce((s, r) => s + (r.total || 0), 0) / entered.length,
          )
        : 0;
    const passes = entered.filter((r) => r.grade && CREDIT.includes(r.grade))
      .length;
    const passRate =
      entered.length > 0 ? Math.round((passes / entered.length) * 100) : 0;
    return {
      total: rows.length,
      entered: entered.length,
      pending: rows.length - entered.length,
      avg,
      passRate,
    };
  }, [rows]);

  if (loading)
    return <div className="py-20 text-center text-sm text-gray-400">Loading…</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
            Score Review
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Review entered scores and completion for a class subject
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            {
              value: selectedClass?.id || "",
              onChange: (v: string) =>
                setSelectedClass(classes.find((c) => c.id === v) || null),
              options: classes.map((c) => ({ v: c.id, l: c.name })),
            },
            {
              value: subject,
              onChange: (v: string) => setSubject(v),
              options: subjects.map((s) => ({ v: s.name, l: s.name })),
            },
            {
              value: term,
              onChange: (v: string) => setTerm(v),
              options: TERMS.map((t) => ({ v: t, l: t })),
            },
          ].map((sel, i) => (
            <div key={i} className="relative">
              <select
                value={sel.value}
                onChange={(e) => sel.onChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
                style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
              >
                {sel.options.length === 0 && <option value="">-</option>}
                {sel.options.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Entered", value: `${stats.entered}/${stats.total}`, color: "var(--royal-blue)", icon: CheckCircle2 },
          { label: "Pending", value: stats.pending, color: "var(--warning)", icon: Clock },
          { label: "Class Average", value: stats.entered ? `${stats.avg}` : "-", color: "var(--success-dark)", icon: TrendingUp },
          { label: "Pass Rate", value: stats.entered ? `${stats.passRate}%` : "-", color: "#7c3aed", icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm" style={{ borderColor: "var(--medium-gray)" }}>
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

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--medium-gray)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="border-b" style={{ backgroundColor: "var(--light-gray)", borderColor: "var(--medium-gray)" }}>
              <tr>
                {["Student", "CA (30)", "Exam (70)", "Total", "Grade", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No students in this class.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => {
                  const entered = r.total !== null;
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--dark-gray)" }}>
                        {r.name}
                      </td>
                      <td className="px-4 py-3 text-center">{r.ca ?? "-"}</td>
                      <td className="px-4 py-3 text-center">{r.exam ?? "-"}</td>
                      <td className="px-4 py-3 text-center font-black" style={{ color: "var(--royal-blue)" }}>
                        {r.total ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {r.grade ? (
                          <span className={`px-2 py-0.5 rounded text-xs font-black ${GRADE_COLOR[r.grade] || "bg-gray-50 text-gray-600"}`}>
                            {r.grade}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: entered ? "#f0fdf4" : "#fffbeb",
                            color: entered ? "var(--success-dark)" : "var(--warning)",
                          }}
                        >
                          {entered ? "Entered" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoreReview;
