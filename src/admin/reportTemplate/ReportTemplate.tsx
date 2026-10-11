import React, { useEffect, useMemo, useState } from "react";
import { Eye, FileText, Printer, RotateCcw, Save } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import {
  REPORT_TEMPLATE_DEFAULTS,
  reportOptions,
  type ReportTemplate as Template,
} from "../../api/settings";
import { resultsApi, type ReportResult } from "../../api/results";
import { studentsApi } from "../../api/students";
import { classesApi } from "../../api/domains";
import {
  PrintableReport,
  TerminalReport,
} from "../../components/report/TerminalReport";
import { surnameFirst } from "../../utils/studentOrder";

const FLAGS: { key: keyof Template; label: string; hint: string }[] = [
  {
    key: "showPosition",
    label: "Class position",
    hint: "e.g. 4th out of 39",
  },
  { key: "showAggregate", label: "Aggregate (best six)", hint: "WASSCE style" },
  { key: "showAverage", label: "Average mark", hint: "Under the subjects" },
  {
    key: "showAttendance",
    label: "Attendance",
    hint: "Days present, absent and late",
  },
  {
    key: "showConduct",
    label: "Conduct, interest and attitude",
    hint: "Entered by the form teacher",
  },
  {
    key: "showFormTeacherRemarks",
    label: "Form teacher's remarks",
    hint: "",
  },
  { key: "showHeadRemarks", label: "Head's remarks", hint: "" },
  {
    key: "showSignatures",
    label: "Signature lines",
    hint: "Form teacher, head and parent",
  },
];

const HEAD_TITLES = [
  "Head of School",
  "Headmaster",
  "Headmistress",
  "Commandant",
  "Principal",
];

// Clearly made-up data so the layout can be judged before any scores exist.
const sampleResult = (term: string, academicYear: string): ReportResult => {
  const subjects: [string, number, number, string, string][] = [
    ["English Language", 24, 52, "A1", "Excellent"],
    ["Core Mathematics", 22, 48, "B2", "Very Good"],
    ["Integrated Science", 20, 45, "B3", "Good"],
    ["Social Studies", 25, 55, "A1", "Excellent"],
    ["Technical Drawing", 21, 41, "C4", "Credit"],
    ["Applied Electricity", 19, 38, "C5", "Credit"],
  ];
  const rows = subjects.map(([name, ca, exam, grade, remarks]) => ({
    name,
    ca,
    exam,
    total: ca + exam,
    grade,
    remarks,
  }));
  return {
    student: {
      id: "sample",
      studentId: "SAMPLE/0001",
      firstName: "Sample",
      lastName: "Student",
      formClass: "Form 1 Sample Class",
      course: "Sample Course",
    },
    term,
    academicYear,
    position: 4,
    positionBasis: "total",
    outOf: 39,
    totalScore: rows.reduce((a, r) => a + r.total, 0),
    totalMax: rows.length * 100,
    aggregate: 16,
    subjects: rows,
    attendance: { present: 58, absent: 2, late: 1, totalDays: 61, rate: 97 },
    comments: {
      formTeacher: "A hard-working student. Keep it up.",
      head: "Good performance; aim higher next term.",
      conduct: "Very good",
      interest: "Keen",
      attitude: "Positive",
    },
  };
};

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors"
    style={{ backgroundColor: checked ? "var(--royal-blue)" : "#d1d5db" }}
  >
    <span
      className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
      style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
    />
  </button>
);

const labelClass = "text-xs font-bold uppercase tracking-wider block mb-1.5";
const inputClass =
  "w-full px-3 py-2 text-sm rounded-xl border-2 outline-none focus:border-[var(--royal-blue)]";

const ReportTemplate = () => {
  const { settings, save } = useSettings();
  const saved = useMemo(() => reportOptions(settings), [settings]);
  const [draft, setDraft] = useState<Template>(saved);
  // True once the user changes something; until then the page follows the
  // saved settings, which arrive after the first render.
  const [edited, setEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const [classes, setClasses] = useState<string[]>([]);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState("");
  const [real, setReal] = useState<ReportResult | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [printing, setPrinting] = useState(false);

  const dirty = (
    Object.keys(REPORT_TEMPLATE_DEFAULTS) as (keyof Template)[]
  ).some((k) => draft[k] !== saved[k]);

  useEffect(() => {
    if (!edited) setDraft(saved);
  }, [saved, edited]);

  useEffect(() => {
    classesApi
      .list()
      .then((cls) =>
        setClasses(
          cls
            .map((c) => c.name)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
        ),
      )
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    setStudents([]);
    setStudentId("");
    setReal(null);
    if (!className) return;
    let alive = true;
    studentsApi
      .list(className)
      .then((list) => alive && setStudents(list))
      .catch(() => alive && setStudents([]));
    return () => {
      alive = false;
    };
  }, [className]);

  useEffect(() => {
    setReal(null);
    setPreviewError("");
    if (!studentId) return;
    let alive = true;
    resultsApi
      .get({
        student: studentId,
        term: settings.currentTerm,
        academicYear: settings.currentAcademicYear,
      })
      .then((r) => alive && setReal(r))
      .catch(
        (err) =>
          alive &&
          setPreviewError(err?.message || "Could not load this report."),
      );
    return () => {
      alive = false;
    };
  }, [studentId, settings.currentTerm, settings.currentAcademicYear]);

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    const t = setTimeout(() => window.print(), 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", done);
    };
  }, [printing]);

  const set = <K extends keyof Template>(key: K, value: Template[K]) => {
    setEdited(true);
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const discard = () => {
    setEdited(false);
    setDraft(saved);
  };

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.headTitle.trim()) {
      showToast("The report title and head's title are required.", "error");
      return;
    }
    setBusy(true);
    try {
      await save({ reportTemplate: draft });
      setEdited(false);
      showToast("Report template saved. Every portal now uses it.");
    } catch (err) {
      showToast(err?.message || "Failed to save the template", "error");
    } finally {
      setBusy(false);
    }
  };

  // The preview always shows the draft, so changes can be judged first.
  const previewSettings = { ...settings, reportTemplate: draft };
  const preview =
    real ?? sampleResult(settings.currentTerm, settings.currentAcademicYear);

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
          role="status"
        >
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Report Template
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Changes here apply to the report card in the student, parent and
            teacher portals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!dirty || busy}
            onClick={discard}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border disabled:opacity-50"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            <RotateCcw size={13} /> Undo changes
          </button>
          <button
            type="button"
            disabled={!dirty || busy}
            onClick={handleSave}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> {busy ? "Saving…" : "Save Template"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-5 items-start">
        <div className="space-y-5">
          <div
            className="bg-white rounded-xl border shadow-sm p-5 space-y-4"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div>
              <label className={labelClass} htmlFor="rt-title">
                Report title
              </label>
              <input
                id="rt-title"
                value={draft.title}
                maxLength={60}
                onChange={(e) => set("title", e.target.value)}
                className={inputClass}
                style={{ borderColor: "var(--medium-gray)" }}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="rt-head">
                Head's title
              </label>
              <input
                id="rt-head"
                list="rt-head-titles"
                value={draft.headTitle}
                maxLength={40}
                onChange={(e) => set("headTitle", e.target.value)}
                className={inputClass}
                style={{ borderColor: "var(--medium-gray)" }}
              />
              <datalist id="rt-head-titles">
                {HEAD_TITLES.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelClass} htmlFor="rt-next">
                Next term begins
              </label>
              <input
                id="rt-next"
                type="date"
                value={draft.nextTermBegins}
                onChange={(e) => set("nextTermBegins", e.target.value)}
                className={inputClass}
                style={{ borderColor: "var(--medium-gray)" }}
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to leave it off the report.
              </p>
            </div>
            <div>
              <label className={labelClass} htmlFor="rt-footer">
                Footer note
              </label>
              <textarea
                id="rt-footer"
                rows={2}
                maxLength={300}
                value={draft.footerNote}
                onChange={(e) => set("footerNote", e.target.value)}
                placeholder="e.g. School fees for next term are due by the first day."
                className={inputClass}
                style={{ borderColor: "var(--medium-gray)" }}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {draft.footerNote.length}/300
              </p>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-xs font-black uppercase tracking-wider mb-2 text-gray-500">
              Show on the report
            </p>
            {FLAGS.map(({ key, label, hint }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {label}
                  </p>
                  {hint && <p className="text-xs text-gray-400">{hint}</p>}
                </div>
                <Toggle
                  checked={draft[key] as boolean}
                  onChange={(v) => set(key, v as never)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setEdited(true);
                setDraft(REPORT_TEMPLATE_DEFAULTS);
              }}
              className="mt-3 text-xs font-semibold"
              style={{ color: "var(--royal-blue)" }}
            >
              Reset to the standard layout
            </button>
          </div>

          <p className="text-xs text-gray-400 px-1">
            The subjects, scores and grades always come from score entry and the
            grading scale (Grading Config). Class position follows the basis
            chosen there.
          </p>
        </div>

        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div
            className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-3 border-b"
            style={{
              borderColor: "var(--medium-gray)",
              backgroundColor: "var(--light-gray)",
            }}
          >
            <p
              className="flex items-center gap-2 text-sm font-bold flex-1"
              style={{ color: "var(--dark-gray)" }}
            >
              <Eye size={15} /> Preview
              <span className="text-xs font-normal text-gray-400">
                {real
                  ? `${surnameFirst(real.student)}, ${real.term} ${real.academicYear}`
                  : "Sample data, not a real student"}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border-2 bg-white"
                style={{ borderColor: "var(--medium-gray)" }}
                aria-label="Preview class"
              >
                <option value="">Sample student</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {className && (
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg border-2 bg-white max-w-[220px]"
                  style={{ borderColor: "var(--medium-gray)" }}
                  aria-label="Preview student"
                >
                  <option value="">
                    {students.length ? "Choose a student" : "No students"}
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {surnameFirst(s)} ({s.studentId})
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => setPrinting(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                <Printer size={13} /> Print
              </button>
            </div>
          </div>
          {previewError && (
            <p
              className="px-5 pt-3 text-xs"
              style={{ color: "var(--accent-red)" }}
            >
              {previewError} The sample is shown instead.
            </p>
          )}
          <div className="p-4 overflow-x-auto bg-gray-100">
            <div
              className="mx-auto shadow-md"
              style={{
                width: 794,
                maxWidth: "none",
                padding: 24,
                background: "#fff",
              }}
            >
              <TerminalReport result={preview} settings={previewSettings} />
            </div>
          </div>
          {!real && (
            <p
              className="flex items-center gap-1.5 px-5 py-3 text-xs text-gray-400 border-t"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <FileText size={12} /> Choose a class and student above to preview
              a real report for {settings.currentTerm}{" "}
              {settings.currentAcademicYear}.
            </p>
          )}
        </div>
      </div>

      {printing && (
        <PrintableReport result={preview} settings={previewSettings} />
      )}
    </div>
  );
};

export default ReportTemplate;
