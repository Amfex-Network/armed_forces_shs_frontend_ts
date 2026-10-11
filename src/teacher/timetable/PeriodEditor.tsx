import React, { useState } from "react";
import { Plus, Save, Trash2, Wand2, X } from "lucide-react";
import {
  periodsApi,
  toPeriodRows,
  type DayPeriod,
  type PeriodKind,
} from "../../api/timetable";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toTime = (mins: number) =>
  `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

interface Pattern {
  start: string;
  lessonMinutes: number;
  lessons: number;
  breakAfter: number;
  breakMinutes: number;
  lunchAfter: number;
  lunchMinutes: number;
}

// Builds a day from the usual shape: equal lessons with a break and lunch.
const fromPattern = (p: Pattern): DayPeriod[] => {
  const out: DayPeriod[] = [];
  let t = toMinutes(p.start);
  for (let n = 1; n <= p.lessons; n++) {
    out.push({
      kind: "lesson",
      label: "",
      start: toTime(t),
      end: toTime(t + p.lessonMinutes),
    });
    t += p.lessonMinutes;
    if (n === p.breakAfter && p.breakMinutes > 0) {
      out.push({
        kind: "break",
        label: "Break",
        start: toTime(t),
        end: toTime(t + p.breakMinutes),
      });
      t += p.breakMinutes;
    }
    if (n === p.lunchAfter && p.lunchMinutes > 0) {
      out.push({
        kind: "lunch",
        label: "Lunch",
        start: toTime(t),
        end: toTime(t + p.lunchMinutes),
      });
      t += p.lunchMinutes;
    }
  }
  return out;
};

const input = "px-2 py-1.5 text-sm rounded-lg border-2 outline-none bg-white";

const PeriodEditor = ({
  periods,
  onSaved,
  onClose,
}: {
  periods: DayPeriod[];
  onSaved: (p: DayPeriod[]) => void;
  onClose: () => void;
}) => {
  const [rows, setRows] = useState<DayPeriod[]>(periods);
  const [pattern, setPattern] = useState<Pattern>({
    start: periods[0]?.start || "07:30",
    lessonMinutes: 50,
    lessons: 8,
    breakAfter: 3,
    breakMinutes: 20,
    lunchAfter: 6,
    lunchMinutes: 40,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (i: number, patch: Partial<DayPeriod>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const addRow = (kind: PeriodKind) =>
    setRows((rs) => {
      const last = rs[rs.length - 1];
      const start = last ? last.end : "07:30";
      const mins = kind === "lesson" ? 50 : kind === "lunch" ? 40 : 20;
      return [
        ...rs,
        {
          kind,
          label: kind === "lesson" ? "" : kind === "lunch" ? "Lunch" : "Break",
          start,
          end: toTime(toMinutes(start) + mins),
        },
      ];
    });

  const setP = (k: keyof Pattern, v: string) =>
    setPattern((p) => ({
      ...p,
      [k]: k === "start" ? v : Math.max(0, Number(v) || 0),
    }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const sorted = [...rows].sort((a, b) => a.start.localeCompare(b.start));
      const saved = await periodsApi.save(sorted);
      onSaved(saved);
    } catch (err) {
      setError(err?.message || "Could not save the periods.");
    } finally {
      setSaving(false);
    }
  };

  const labels = toPeriodRows(rows);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
          }}
        >
          <div>
            <p className="font-black">School Day Periods</p>
            <p className="text-xs text-blue-200">
              Used by every class timetable, and shown to students
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div
            className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Quick fill
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500">
              <label>
                First lesson starts
                <input
                  type="time"
                  value={pattern.start}
                  onChange={(e) => setP("start", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
              <label>
                Lesson length (min)
                <input
                  type="number"
                  min={10}
                  value={pattern.lessonMinutes}
                  onChange={(e) => setP("lessonMinutes", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
              <label>
                Lessons per day
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={pattern.lessons}
                  onChange={(e) => setP("lessons", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
              <span />
              <label>
                Break after lesson
                <input
                  type="number"
                  min={0}
                  value={pattern.breakAfter}
                  onChange={(e) => setP("breakAfter", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
              <label>
                Break length (min)
                <input
                  type="number"
                  min={0}
                  value={pattern.breakMinutes}
                  onChange={(e) => setP("breakMinutes", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
              <label>
                Lunch after lesson
                <input
                  type="number"
                  min={0}
                  value={pattern.lunchAfter}
                  onChange={(e) => setP("lunchAfter", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
              <label>
                Lunch length (min)
                <input
                  type="number"
                  min={0}
                  value={pattern.lunchMinutes}
                  onChange={(e) => setP("lunchMinutes", e.target.value)}
                  className={`${input} w-full mt-1`}
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setRows(fromPattern(pattern))}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
              style={{
                borderColor: "var(--royal-blue)",
                color: "var(--royal-blue)",
              }}
            >
              <Wand2 size={13} /> Fill the day below
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Periods (edit any start or end time)
            </p>
            {rows.map((r, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <select
                  value={r.kind}
                  onChange={(e) =>
                    update(i, { kind: e.target.value as PeriodKind })
                  }
                  className={input}
                  style={{ borderColor: "var(--medium-gray)" }}
                  aria-label={`Row ${i + 1} type`}
                >
                  <option value="lesson">Lesson</option>
                  <option value="break">Break</option>
                  <option value="lunch">Lunch</option>
                </select>
                {r.kind === "lesson" ? (
                  <span
                    className="w-32 text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {labels[i]?.label}
                  </span>
                ) : (
                  <input
                    value={r.label}
                    maxLength={40}
                    onChange={(e) => update(i, { label: e.target.value })}
                    className={`${input} w-32`}
                    style={{ borderColor: "var(--medium-gray)" }}
                    aria-label={`Row ${i + 1} name`}
                  />
                )}
                <input
                  type="time"
                  value={r.start}
                  onChange={(e) => update(i, { start: e.target.value })}
                  className={input}
                  style={{ borderColor: "var(--medium-gray)" }}
                  aria-label={`Row ${i + 1} start`}
                />
                <span className="text-gray-400">to</span>
                <input
                  type="time"
                  value={r.end}
                  onChange={(e) => update(i, { end: e.target.value })}
                  className={input}
                  style={{ borderColor: "var(--medium-gray)" }}
                  aria-label={`Row ${i + 1} end`}
                />
                <button
                  type="button"
                  onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  className="p-1.5 rounded-lg hover:bg-red-50"
                  aria-label={`Remove row ${i + 1}`}
                >
                  <Trash2 size={14} style={{ color: "var(--accent-red)" }} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              {(["lesson", "break", "lunch"] as PeriodKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => addRow(k)}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border capitalize"
                  style={{
                    borderColor: "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                >
                  <Plus size={12} /> {k}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Lessons already on a timetable keep their period number. If you
            remove lesson periods, first clear any lessons booked in them.
          </p>
          {error && (
            <p className="text-sm" style={{ color: "var(--accent-red)" }}>
              {error}
            </p>
          )}
        </div>

        <div
          className="flex justify-end gap-3 px-6 py-4 border-t"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl border"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || rows.length === 0}
            onClick={save}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> {saving ? "Saving…" : "Save Periods"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodEditor;
