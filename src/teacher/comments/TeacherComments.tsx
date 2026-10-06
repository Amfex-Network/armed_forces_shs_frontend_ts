import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  CheckSquare,
  Square,
  Users,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { classesApi } from "../../api/domains";
import { studentsApi } from "../../api/students";
import { commentsApi } from "../../api/comments";
import { useSettings } from "../../context/SettingsContext";
import { Avatar, PageHeader } from "../components/TeacherUI";
import { sameClass } from "../../utils/classNames";

const TEMPLATES = [
  "An excellent and hardworking student. Keep it up.",
  "A good performance this term. Aim even higher next time.",
  "Shows steady improvement. Encouraged to stay focused.",
  "Capable of much better. Needs to be more serious with studies.",
  "Must improve on class participation and assignments.",
];

interface Row {
  id: string;
  studentId: string;
  name: string;
  formClass?: string;
  comment: string;
  commentId?: string;
  saved: boolean;
}

const TeacherComments = () => {
  const { settings } = useSettings();
  const ACADEMIC_YEAR = settings.currentAcademicYear;
  const TERMS = settings.terms;
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [term, setTerm] = useState(settings.currentTerm);
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    (async () => {
      try {
        const cls = await classesApi.list();
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
      setRows([]);
      return;
    }
    let active = true;
    (async () => {
      try {
        const [studs, comments] = await Promise.all([
          studentsApi.list(),
          commentsApi
            .list({
              formClass: selectedClass.name,
              term,
              academicYear: ACADEMIC_YEAR,
            })
            .catch(() => []),
        ]);
        if (!active) return;
        const inClass = studs.filter((s) =>
          sameClass(s.formClass, selectedClass.name),
        );
        const byStudent: Record<string, any> = {};
        comments.forEach((c) => {
          const sid = typeof c.student === "object" ? c.student._id : c.student;
          byStudent[sid] = c;
        });
        setRows(
          inClass.map((s) => {
            const c = byStudent[s.id as string];
            return {
              id: s.id as string,
              studentId: s.studentId,
              name: `${s.firstName} ${s.lastName}`,
              formClass: s.formClass,
              comment: c?.formTeacherComment || "",
              commentId: c?.id,
              saved: !!c?.formTeacherComment,
            };
          }),
        );
        setSelected([]);
        setBulkText("");
      } catch {
        if (active) setRows([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedClass, term]);

  const toggleStudent = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const selectAll = () =>
    setSelected((prev) =>
      prev.length === rows.length ? [] : rows.map((r) => r.id),
    );
  const clearSelection = () => {
    setSelected([]);
    setBulkText("");
  };

  const selectedRows = useMemo(
    () => rows.filter((r) => selected.includes(r.id)),
    [rows, selected],
  );

  const applyBulk = () => {
    if (!bulkText.trim() || selected.length === 0) return;
    setRows((rs) =>
      rs.map((r) =>
        selected.includes(r.id) ? { ...r, comment: bulkText, saved: false } : r,
      ),
    );
  };

  const setRowComment = (id: string, value: string) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, comment: value, saved: false } : r)),
    );

  const handleSave = async () => {
    if (!selectedClass) return;
    const applied = bulkText.trim()
      ? rows.map((r) =>
          selected.includes(r.id) ? { ...r, comment: bulkText } : r,
        )
      : rows;
    const toSave = applied.filter(
      (r) => selected.includes(r.id) && r.comment.trim(),
    );
    if (toSave.length === 0) {
      showToast("Select students and write a comment first", "error");
      return;
    }
    try {
      setSaving(true);
      const results = await Promise.all(
        toSave.map((r) =>
          commentsApi.save({
            student: r.id,
            academicYear: ACADEMIC_YEAR,
            term,
            formClass: selectedClass.name,
            formTeacherComment: r.comment,
          }),
        ),
      );
      const savedIds = new Set(toSave.map((r) => r.id));
      const idMap: Record<string, string> = {};
      results.forEach((c) => {
        const sid = typeof c.student === "object" ? c.student._id : c.student;
        if (c.id) idMap[sid as string] = c.id;
      });
      setRows((rs) =>
        rs.map((r) =>
          savedIds.has(r.id)
            ? {
                ...r,
                comment: bulkText.trim() ? bulkText : r.comment,
                commentId: idMap[r.id] || r.commentId,
                saved: true,
              }
            : r,
        ),
      );
      showToast(`Saved ${toSave.length} comment(s)`);
      clearSelection();
    } catch (err: any) {
      showToast(err?.message || "Failed to save comments", "error");
    } finally {
      setSaving(false);
    }
  };

  const savedCount = rows.filter((r) => r.saved).length;

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
        >
          {toast.type === "error" ? <X size={14} /> : <Check size={14} />}
          {toast.msg}
        </div>
      )}

      <PageHeader title="Student Comments & Remarks" />

      {/* Controls */}
      <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              value={selectedClass?.id || ""}
              onChange={(e) =>
                setSelectedClass(
                  classes.find((c) => c.id === e.target.value) || null,
                )
              }
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border-2 outline-none bg-white"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              {classes.length === 0 && <option value="">No classes</option>}
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Term
          </label>
          <div className="relative">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border-2 outline-none bg-white"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t} · {ACADEMIC_YEAR}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Student list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              backgroundColor: "var(--light-gray)",
              borderColor: "var(--medium-gray)",
            }}
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--dark-gray)" }}
              >
                {selectedClass?.name || "-"}
              </p>
              <p className="text-xs text-gray-400">
                {rows.length} students · {savedCount} with comments
              </p>
            </div>
            {rows.length > 0 && (
              <button
                onClick={selectAll}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "var(--royal-blue)",
                }}
              >
                {selected.length === rows.length ? "Clear" : "Select all"}
              </button>
            )}
          </div>

          <div
            className="divide-y"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {rows.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400">
                {loading ? "Loading…" : "No students in this class yet."}
              </p>
            ) : (
              rows.map((r) => {
                const isSelected = selected.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleStudent(r.id)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                    style={{
                      backgroundColor: isSelected ? "#eef2ff" : "white",
                      borderLeft: `3px solid ${isSelected ? "var(--royal-blue)" : "transparent"}`,
                    }}
                  >
                    <div
                      style={{
                        color: isSelected
                          ? "var(--royal-blue)"
                          : "var(--medium-gray)",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </div>
                    <Avatar
                      name={r.name}
                      size="sm"
                      color={
                        isSelected
                          ? "bg-blue-700"
                          : r.saved
                            ? "bg-green-600"
                            : "bg-gray-400"
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {r.name}
                      </p>
                      <p className="text-xs text-gray-400">{r.studentId}</p>
                    </div>
                    {r.saved ? (
                      <span
                        className="text-xs flex items-center gap-0.5 flex-shrink-0"
                        style={{ color: "var(--success-dark)" }}
                      >
                        <Check size={11} /> Saved
                      </span>
                    ) : r.comment.trim() ? (
                      <span
                        className="w-2 h-2 rounded-full block flex-shrink-0"
                        style={{ backgroundColor: "var(--warning)" }}
                        title="Unsaved draft"
                      />
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 space-y-4">
          {selected.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm p-10 text-center">
              <Users
                size={40}
                className="mx-auto mb-3 opacity-20"
                style={{ color: "var(--royal-blue)" }}
              />
              <p className="text-sm font-medium text-gray-500">
                No students selected
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Select students from the list to write their comments.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm overflow-hidden">
              <div
                className="px-5 py-3 border-b flex items-center justify-between"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {selected.length === 1
                      ? selectedRows[0].name
                      : `${selected.length} Students Selected`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selected.length === 1
                      ? selectedRows[0].studentId
                      : "Comment applies to all selected"}
                  </p>
                </div>
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                  style={{ color: "var(--accent-red)" }}
                >
                  <X size={11} /> Clear
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* single-student existing comment editor */}
                {selected.length === 1 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Teacher's Comment
                    </label>
                    <textarea
                      value={selectedRows[0].comment}
                      onChange={(e) =>
                        setRowComment(
                          selectedRows[0].id,
                          e.target.value.slice(0, 500),
                        )
                      }
                      rows={4}
                      placeholder={`Write a comment for ${selectedRows[0].name}…`}
                      className="w-full px-3 py-2 text-sm border-2 rounded-lg resize-none focus:outline-none"
                      style={{ borderColor: "var(--medium-gray)" }}
                    />
                  </div>
                )}

                {/* Templates */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Quick Templates
                  </label>
                  <div className="space-y-1.5">
                    {TEMPLATES.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (selected.length === 1) {
                            setRowComment(selectedRows[0].id, t);
                          } else {
                            setBulkText(t);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg border-2 transition-all"
                        style={{
                          borderColor: "var(--medium-gray)",
                          backgroundColor: "white",
                          color: "var(--dark-gray)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bulk textarea (multi) */}
                {selected.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Comment for all {selected.length} selected
                      <span className="font-normal text-gray-400 ml-1 normal-case">
                        ({bulkText.length}/500)
                      </span>
                    </label>
                    <textarea
                      value={bulkText}
                      onChange={(e) =>
                        setBulkText(e.target.value.slice(0, 500))
                      }
                      rows={4}
                      placeholder={`This comment will be applied to all ${selected.length} selected students…`}
                      className="w-full px-3 py-2 text-sm border-2 rounded-lg resize-none focus:outline-none"
                      style={{ borderColor: "var(--medium-gray)" }}
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {selected.length > 1 && (
                    <button
                      onClick={applyBulk}
                      disabled={!bulkText.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg border-2 disabled:opacity-40"
                      style={{
                        borderColor: "var(--royal-blue)",
                        color: "var(--royal-blue)",
                        backgroundColor: "white",
                      }}
                    >
                      <Users size={13} /> Apply to {selected.length}
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-40"
                    style={{ backgroundColor: "var(--royal-blue)" }}
                  >
                    <Save size={13} />
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherComments;
