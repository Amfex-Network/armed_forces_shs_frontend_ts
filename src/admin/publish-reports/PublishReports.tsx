import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Send,
  Lock,
  ChevronDown,
  Search,
  FileText,
  Users,
  BookOpen,
} from "lucide-react";
import { classesApi } from "../../api/domains";
import { studentsApi } from "../../api/students";
import { scoresApi } from "../../api/scores";
import { publicationsApi } from "../../api/publications";
import { useSettings } from "../../context/SettingsContext";
import { sameClass } from "../../utils/classNames";

interface ClassRow {
  formClass: string;
  course?: string;
  students: number;
  scored: number;
  published: boolean;
}

const PublishReports = () => {
  const { settings } = useSettings();
  const ACADEMIC_YEAR = settings.currentAcademicYear;
  const TERMS = settings.terms;
  const [term, setTerm] = useState(settings.currentTerm);
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const [classes, students, scores, pubs] = await Promise.all([
        classesApi.list(),
        studentsApi.list(),
        scoresApi.list({ term, academicYear: ACADEMIC_YEAR }).catch(() => []),
        publicationsApi
          .list({ term, academicYear: ACADEMIC_YEAR })
          .catch(() => []),
      ]);

      const scoredByClass: Record<string, Set<string>> = {};
      scores.forEach((sc: any) => {
        const fc = sc.formClass;
        const sid =
          typeof sc.student === "object" ? sc.student?._id : sc.student;
        if (!fc || !sid) return;
        (scoredByClass[fc] = scoredByClass[fc] || new Set()).add(sid);
      });

      const pubByClass: Record<string, boolean> = {};
      pubs.forEach((p) => {
        pubByClass[p.formClass] = p.published;
      });

      const built: ClassRow[] = classes.map((c: any) => {
        const inClass = students.filter((s) => sameClass(s.formClass, c.name));
        return {
          formClass: c.name,
          course: c.course || c.program,
          students: inClass.length,
          scored: scoredByClass[c.name]?.size || 0,
          published: !!pubByClass[c.name],
        };
      });
      setRows(built);
    } catch (err: any) {
      showToast(err?.message || "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, ACADEMIC_YEAR]);

  const togglePublish = async (row: ClassRow) => {
    try {
      setBusy(row.formClass);
      await publicationsApi.set({
        formClass: row.formClass,
        academicYear: ACADEMIC_YEAR,
        term,
        published: !row.published,
      });
      setRows((rs) =>
        rs.map((r) =>
          r.formClass === row.formClass ? { ...r, published: !r.published } : r,
        ),
      );
      showToast(
        !row.published
          ? `${row.formClass} reports published`
          : `${row.formClass} reports unpublished`,
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to update", "error");
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          !search ||
          r.formClass.toLowerCase().includes(search.toLowerCase()) ||
          (r.course || "").toLowerCase().includes(search.toLowerCase()),
      ),
    [rows, search],
  );

  const totalClasses = rows.length;
  const published = rows.filter((r) => r.published).length;
  const pending = totalClasses - published;

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
          <CheckCircle2 size={14} />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Publish Reports
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Control which class reports are visible to students & parents
          </p>
        </div>
        <div className="relative">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
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
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--royal-blue)" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Classes",
            value: totalClasses,
            color: "var(--royal-blue)",
            icon: BookOpen,
          },
          {
            label: "Published",
            value: published,
            color: "var(--success-dark)",
            icon: CheckCircle2,
          },
          {
            label: "Pending",
            value: pending,
            color: "var(--warning)",
            icon: Clock,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p
                className="text-xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class or course…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {[
                  "Class",
                  "Course",
                  "Students",
                  "Scores Entered",
                  "Status",
                  "Action",
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    {loading
                      ? "Loading…"
                      : rows.length === 0
                        ? "No classes set up yet."
                        : "No classes match your search"}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const complete = r.students > 0 && r.scored >= r.students;
                  return (
                    <tr
                      key={r.formClass}
                      className="hover:bg-gray-50 transition"
                    >
                      <td
                        className="px-4 py-3 font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {r.formClass}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {r.course || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <Users size={12} /> {r.students}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: complete ? "#f0fdf4" : "#fffbeb",
                            color: complete
                              ? "var(--success-dark)"
                              : "var(--warning)",
                          }}
                        >
                          {r.scored}/{r.students}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: r.published
                              ? "#f0fdf4"
                              : "#f3f4f6",
                            color: r.published
                              ? "var(--success-dark)"
                              : "#6b7280",
                          }}
                        >
                          {r.published ? (
                            <>
                              <CheckCircle2 size={12} /> Published
                            </>
                          ) : (
                            <>
                              <Clock size={12} /> Not published
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublish(r)}
                          disabled={busy === r.formClass}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
                          style={{
                            backgroundColor: r.published
                              ? "var(--accent-red)"
                              : "var(--royal-blue)",
                          }}
                        >
                          {r.published ? (
                            <>
                              <Lock size={12} /> Unpublish
                            </>
                          ) : (
                            <>
                              <Send size={12} /> Publish
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-4 rounded-xl border text-xs"
        style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
      >
        <FileText
          size={15}
          style={{ color: "var(--royal-blue)" }}
          className="flex-shrink-0 mt-0.5"
        />
        <p style={{ color: "#1e40af" }}>
          Students and parents can only see a term's report card and results
          once the class is <strong>Published</strong>. Unpublishing hides them
          again instantly. Teachers and admins can always preview.
        </p>
      </div>
    </div>
  );
};

export default PublishReports;
