// src/teacher/scores/TeacherScores.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Save,
  CheckCircle2,
  Search,
  Send,
  Clock,
  Lock,
  Download,
} from "lucide-react";
import { classesApi, subjectsApi } from "../../api/domains";
import { studentsApi } from "../../api/students";
import { scoresApi } from "../../api/scores";
import { useSettings } from "../../context/SettingsContext";

// submission status per class: null | 'saved' | 'submitted' | 'approved' | 'rejected'
const SUBMIT_STATUS = {
  saved: { label: "Draft Saved", color: "var(--warning)", bg: "#fffbeb" },
  submitted: {
    label: "Submitted for Review",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
  },
  approved: { label: "Approved", color: "var(--success-dark)", bg: "#f0fdf4" },
  rejected: {
    label: "Returned for Correction",
    color: "var(--accent-red)",
    bg: "#fff1f2",
  },
};

const gradeFromTotal = (total) => {
  if (total >= 80) return "A1";
  if (total >= 70) return "B2";
  if (total >= 65) return "B3";
  if (total >= 60) return "C4";
  if (total >= 55) return "C5";
  if (total >= 50) return "C6";
  if (total >= 45) return "D7";
  if (total >= 40) return "E8";
  return "F9";
};

const GRADE_COLORS = {
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

const TeacherScores = () => {
  const { settings } = useSettings();
  const TERMS = settings.terms;
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [term, setTerm] = useState(settings.currentTerm);
  const academicYear = settings.currentAcademicYear;
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [classStatus, setClassStatus] = useState<Record<string, string>>({});
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
        if (subs.length) setSelectedSubject(subs[0].name);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedSubject) {
      setStudents([]);
      return;
    }
    let active = true;
    (async () => {
      try {
        const [studs, scores] = await Promise.all([
          studentsApi.list(),
          scoresApi.list({
            subject: selectedSubject,
            term,
            academicYear,
            formClass: selectedClass.name,
          }),
        ]);
        if (!active) return;
        const inClass = studs.filter((s) => s.formClass === selectedClass.name);
        const scoreByStudent: Record<string, any> = {};
        scores.forEach((sc) => {
          const sid =
            typeof sc.student === "object" ? sc.student._id : sc.student;
          scoreByStudent[sid] = sc;
        });
        setStudents(
          inClass.map((s) => {
            const sc = scoreByStudent[s.id];
            return {
              id: s.id,
              studentId: s.studentId,
              name: `${s.firstName} ${s.lastName}`,
              ca: sc ? sc.classScore : null,
              exam: sc ? sc.examScore : null,
              scoreId: sc ? sc.id : null,
            };
          }),
        );
      } catch {
        if (active) setStudents([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedClass, selectedSubject, term, academicYear]);

  const currentStatus = selectedClass ? classStatus[selectedClass.id] : null;
  const isLocked =
    currentStatus === "submitted" || currentStatus === "approved";

  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSaved(false);
    setErrors({});
  };

  const updateScore = (sid, field, value) => {
    const num = value === "" ? null : parseInt(value);
    setStudents((ss) =>
      ss.map((s) => (s.id === sid ? { ...s, [field]: num } : s)),
    );
    setErrors((e) => {
      const ne = { ...e };
      delete ne[`${sid}_${field}`];
      return ne;
    });
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    students.forEach((s) => {
      if (s.ca !== null && (s.ca < 0 || s.ca > 30)) e[`${s.id}_ca`] = "0–30";
      if (s.exam !== null && (s.exam < 0 || s.exam > 70))
        e[`${s.id}_exam`] = "0–70";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const persistScores = async () => {
    const toSave = students.filter((s) => s.ca !== null && s.exam !== null);
    const results = await Promise.all(
      toSave.map((s) =>
        s.scoreId
          ? scoresApi.update(s.scoreId, { classScore: s.ca, examScore: s.exam })
          : scoresApi.create({
              student: s.id,
              subject: selectedSubject,
              academicYear,
              term,
              formClass: selectedClass.name,
              classScore: s.ca,
              examScore: s.exam,
            }),
      ),
    );
    const byStudent: Record<string, any> = {};
    results.forEach((r) => {
      const sid = typeof r.student === "object" ? r.student._id : r.student;
      byStudent[sid] = r;
    });
    setStudents((ss) =>
      ss.map((s) =>
        byStudent[s.id] ? { ...s, scoreId: byStudent[s.id].id } : s,
      ),
    );
  };

  const handleSave = async () => {
    if (!validate() || !selectedClass || !selectedSubject) return;
    try {
      setSaving(true);
      await persistScores();
      setSaved(true);
      setClassStatus((s) => ({ ...s, [selectedClass.id]: "saved" }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err?.message || "Failed to save scores");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedClass) return;
    if (pending > 0) {
      alert(
        `Please enter scores for all ${pending} remaining student(s) before submitting.`,
      );
      return;
    }
    try {
      setSaving(true);
      await persistScores();
      setClassStatus((s) => ({ ...s, [selectedClass.id]: "submitted" }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err?.message || "Failed to submit scores");
    } finally {
      setSaving(false);
    }
  };

  const handleRecall = () => {
    if (selectedClass)
      setClassStatus((s) => ({ ...s, [selectedClass.id]: "saved" }));
  };

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.studentId.includes(search),
      ),
    [students, search],
  );

  const submitted = students.filter(
    (s) => s.ca !== null && s.exam !== null,
  ).length;
  const pending = students.length - submitted;
  const hasErrors = Object.keys(errors).length > 0;
  const getTotal = (s) =>
    s.ca !== null && s.exam !== null ? s.ca + s.exam : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Score Entry
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {selectedSubject || "Select a subject"} · {term} · {academicYear}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sample Guide */}
          <button
            type="button"
            onClick={() => {
              const lines = [
                "============================================",
                "AFSHTS SCORE ENTRY - SAMPLE GUIDE",
                "============================================",
                "",
                "HOW TO ENTER SCORES:",
                "  • CA Score   : Continuous Assessment - maximum 30 marks",
                "  • Exam Score : End of Semester Examination - maximum 70 marks",
                "  • Total      : CA + Exam = 100 marks (calculated automatically)",
                "",
                "GRADING SCALE:",
                "  A1  : 80 – 100  (Excellent)",
                "  B2  : 70 – 79   (Very Good)",
                "  B3  : 65 – 69   (Good)",
                "  C4  : 60 – 64   (Credit)",
                "  C5  : 55 – 59   (Credit)",
                "  C6  : 50 – 54   (Credit)",
                "  D7  : 45 – 49   (Pass)",
                "  E8  : 40 – 44   (Pass)",
                "  F9  : 0  – 39   (Fail)",
                "",
                "SUBMISSION RULES:",
                "  1. Enter scores for ALL students before submitting.",
                '  2. Click "Save Draft" to save your progress.',
                '  3. Click "Submit for Review" when all scores are entered.',
                "  4. Scores are LOCKED after submission.",
                '  5. Use "Recall" to pull back and make corrections before approval.',
                "  6. The Form Master will approve or return for correction.",
                "",
                "NOTES:",
                "  - CA scores must be between 0 and 30.",
                "  - Exam scores must be between 0 and 70.",
                "  - Contact the Admin office for any corrections after approval.",
                "============================================",
              ];
              const blob = new Blob([lines.join("\n")], { type: "text/plain" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "AFSHTS_Score_Entry_Guide.txt";
              a.click();
            }}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition"
            style={{
              borderColor: "var(--success-dark)",
              color: "var(--success-dark)",
              backgroundColor: "#f0fdf4",
            }}
          >
            <Download size={14} /> Sample Guide
          </button>

          {currentStatus && SUBMIT_STATUS[currentStatus] && (
            <span
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl"
              style={{
                backgroundColor: SUBMIT_STATUS[currentStatus].bg,
                color: SUBMIT_STATUS[currentStatus].color,
              }}
            >
              {currentStatus === "submitted" ? (
                <Clock size={12} />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {SUBMIT_STATUS[currentStatus].label}
            </span>
          )}
          {currentStatus === "submitted" && (
            <button
              type="button"
              onClick={handleRecall}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border"
              style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
            >
              Recall
            </button>
          )}
          {!isLocked && (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
              style={{
                backgroundColor: hasErrors
                  ? "var(--accent-red)"
                  : "var(--royal-blue)",
              }}
            >
              <Save size={15} />{" "}
              {saving
                ? "Saving…"
                : saved
                  ? "Saved!"
                  : hasErrors
                    ? "Fix Errors"
                    : "Save Draft"}
            </button>
          )}
          {!isLocked && (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
              style={{
                backgroundColor:
                  pending > 0 ? "#9ca3af" : "var(--success-dark)",
              }}
              title={
                pending > 0
                  ? `${pending} scores missing`
                  : "Submit for Form Master review"
              }
            >
              <Send size={15} /> Submit for Review
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: "#f0fdf4",
            color: "var(--success-dark)",
            border: "1px solid #bbf7d0",
          }}
        >
          <CheckCircle2 size={16} /> Scores saved for {selectedClass?.name}
        </div>
      )}

      {/* Class picker */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[160px]">
            <label
              className="text-xs font-black uppercase tracking-widest block mb-1"
              style={{ color: "var(--dark-gray)", opacity: 0.5 }}
            >
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border-2 outline-none bg-white"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[120px]">
            <label
              className="text-xs font-black uppercase tracking-widest block mb-1"
              style={{ color: "var(--dark-gray)", opacity: 0.5 }}
            >
              Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border-2 outline-none bg-white"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {TERMS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <p
          className="text-xs font-black uppercase tracking-widest mb-3"
          style={{ color: "var(--dark-gray)", opacity: 0.5 }}
        >
          Select Class
        </p>
        {classes.length === 0 && (
          <p className="text-sm text-gray-400 py-4">
            {loading
              ? "Loading classes…"
              : "No classes yet - an admin needs to create classes first."}
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              type="button"
              onClick={() => handleClassChange(cls)}
              className="p-3 rounded-xl border-2 text-left text-xs transition-all"
              style={{
                borderColor:
                  selectedClass?.id === cls.id
                    ? "var(--royal-blue)"
                    : "var(--medium-gray)",
                backgroundColor:
                  selectedClass?.id === cls.id ? "#eef2ff" : "white",
              }}
            >
              <p
                className="font-bold truncate"
                style={{
                  color:
                    selectedClass?.id === cls.id
                      ? "var(--royal-blue)"
                      : "var(--dark-gray)",
                }}
              >
                {cls.name}
              </p>
              <p className="text-gray-400 mt-0.5">
                {cls.enrolled ?? 0} students
              </p>
              <span
                className="inline-block mt-1 px-1 py-0.5 rounded text-xs font-bold"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "var(--royal-blue)",
                }}
              >
                {cls.yearGroup || "Form 1"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total",
            value: students.length,
            color: "var(--royal-blue)",
          },
          { label: "Done", value: submitted, color: "var(--success-dark)" },
          {
            label: "Pending",
            value: pending,
            color: pending > 0 ? "var(--accent-red)" : "var(--success-dark)",
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

      {/* Guidelines */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-xl border"
        style={{ backgroundColor: "#eef2ff", borderColor: "#c7d2fe" }}
      >
        <span
          className="text-xs font-bold"
          style={{ color: "var(--royal-blue)" }}
        >
          Marking:
        </span>
        {[
          ["CA", "0–30"],
          ["Exam", "0–70"],
          ["Total", "100"],
          ["Pass", "50+"],
          ["Credit", "60+"],
          ["A1", "80+"],
        ].map(([k, v]) => (
          <span
            key={k}
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ backgroundColor: "white", color: "var(--royal-blue)" }}
          >
            {k}: {v}
          </span>
        ))}
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            {selectedClass?.name} · {selectedSubject}
          </h3>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 pr-3 py-2 text-sm rounded-xl border outline-none w-44"
              style={{ borderColor: "var(--medium-gray)" }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--royal-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--medium-gray)")
              }
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {[
                  "#",
                  "Student",
                  "CA (/30)",
                  "Exam (/70)",
                  "Total",
                  "Grade",
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
              {filtered.map((s, i) => {
                const total = getTotal(s);
                const grade = total !== null ? gradeFromTotal(total) : null;
                const caErr = errors[`${s.id}_ca`];
                const exErr = errors[`${s.id}_exam`];
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs text-gray-400">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <p
                        className="font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs font-mono text-gray-400">
                        {s.studentId}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={s.ca ?? ""}
                        onChange={(e) =>
                          updateScore(s.id, "ca", e.target.value)
                        }
                        disabled={isLocked}
                        placeholder="-"
                        className="w-20 px-2 py-1.5 text-sm rounded-lg border-2 outline-none text-center"
                        style={{
                          borderColor: caErr
                            ? "var(--accent-red)"
                            : "var(--medium-gray)",
                          color: "var(--dark-gray)",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--royal-blue)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = caErr
                            ? "var(--accent-red)"
                            : "var(--medium-gray)")
                        }
                      />
                      {caErr && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--accent-red)" }}
                        >
                          {caErr}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        max="70"
                        value={s.exam ?? ""}
                        onChange={(e) =>
                          updateScore(s.id, "exam", e.target.value)
                        }
                        disabled={isLocked}
                        placeholder="-"
                        className="w-20 px-2 py-1.5 text-sm rounded-lg border-2 outline-none text-center"
                        style={{
                          borderColor: exErr
                            ? "var(--accent-red)"
                            : "var(--medium-gray)",
                          color: "var(--dark-gray)",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--royal-blue)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = exErr
                            ? "var(--accent-red)"
                            : "var(--medium-gray)")
                        }
                      />
                      {exErr && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--accent-red)" }}
                        >
                          {exErr}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {total !== null ? (
                        <span
                          className="font-black text-base"
                          style={{
                            color:
                              total >= 80
                                ? "var(--success-dark)"
                                : total >= 60
                                  ? "var(--royal-blue)"
                                  : total >= 50
                                    ? "var(--warning)"
                                    : "var(--accent-red)",
                          }}
                        >
                          {total}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {grade ? (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-black ${GRADE_COLORS[grade] || "bg-gray-50 text-gray-600"}`}
                        >
                          {grade}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="flex items-center justify-between px-5 py-3.5 border-t"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: pending > 0 ? "var(--warning)" : "var(--success-dark)",
            }}
          >
            {pending > 0
              ? `${pending} student(s) still need scores`
              : "All scores entered"}
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-xl text-white"
            style={{
              backgroundColor: hasErrors
                ? "var(--accent-red)"
                : "var(--royal-blue)",
            }}
          >
            <Save size={14} />{" "}
            {saving
              ? "Saving…"
              : saved
                ? "Saved!"
                : hasErrors
                  ? "Fix Errors"
                  : "Save Scores"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherScores;
