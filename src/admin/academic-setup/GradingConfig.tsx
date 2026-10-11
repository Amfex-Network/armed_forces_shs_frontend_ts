import React, { useEffect, useRef, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Info,
  Calendar,
} from "lucide-react";
import {
  useSettings,
  DEFAULT_GRADING_SCALE,
} from "../../context/SettingsContext";
import type { AppSettings, GradeBand, PositionBasis } from "../../api/settings";

const POSITION_OPTIONS: {
  value: PositionBasis;
  label: string;
  help: string;
}[] = [
  {
    value: "total",
    label: "Total marks",
    help: "Highest total of all subject marks comes first. Students who sat fewer subjects rank lower.",
  },
  {
    value: "average",
    label: "Average mark",
    help: "Highest average per subject comes first. Fair when students take different numbers of subjects.",
  },
  {
    value: "aggregate",
    label: "Aggregate (best six)",
    help: "Lowest aggregate of the six best grades comes first, as in WASSCE. Students with fewer than six graded subjects are ranked after everyone with a full aggregate.",
  },
];

export type SettingsCollector = () => {
  payload?: Partial<AppSettings>;
  error?: string;
};

interface Props {
  collectRef?: React.MutableRefObject<SettingsCollector | null>;
  dirtyRef?: React.MutableRefObject<boolean>;
}

const GradingConfig = ({ collectRef, dirtyRef }: Props = {}) => {
  const { settings, loading, save } = useSettings();
  const ownDirty = useRef(false);
  const dirty = dirtyRef || ownDirty;
  const [badRow, setBadRow] = useState<number | null>(null);

  const [scale, setScale] = useState<GradeBand[]>([]);
  const [currentYear, setCurrentYear] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [years, setYears] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [positionBasis, setPositionBasis] = useState<PositionBasis>("total");
  const [newYear, setNewYear] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Re-sync from the server only while there are no unsaved edits here.
  useEffect(() => {
    if (dirty.current) return;
    setScale(settings.gradingScale.map((b) => ({ ...b })));
    setCurrentYear(settings.currentAcademicYear);
    setCurrentTerm(settings.currentTerm);
    setYears(settings.academicYears);
    setTerms(settings.terms);
    setPositionBasis(settings.positionBasis || "total");
  }, [settings, dirty]);

  const touch = () => {
    dirty.current = true;
  };

  const setBand = (i: number, key: keyof GradeBand, value: string) => {
    touch();
    setBadRow(null);
    setScale((s) =>
      s.map((b, idx) =>
        idx === i
          ? {
              ...b,
              [key]:
                key === "minScore" || key === "points"
                  ? Number(value) || 0
                  : key === "grade"
                    ? value.toUpperCase()
                    : value,
            }
          : b,
      ),
    );
  };

  const addBand = () => {
    touch();
    setScale((s) => [...s, { grade: "", minScore: 0, label: "", points: 9 }]);
  };
  const removeBand = (i: number) => {
    touch();
    setBadRow(null);
    setScale((s) => s.filter((_, idx) => idx !== i));
  };

  // Rows left completely empty (e.g. an unused "Add Band") are ignored.
  const isBlank = (b: GradeBand) =>
    !(b.grade || "").trim() && !(b.label || "").trim() && !b.minScore;

  const collect = (): ReturnType<SettingsCollector> => {
    const bands = scale
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => !isBlank(b));
    if (bands.length === 0) return { error: "Add at least one grade band." };
    const seen = new Set<string>();
    for (const { b, i } of bands) {
      const grade = (b.grade || "").trim();
      if (!grade) {
        setBadRow(i);
        return {
          error: `Row ${i + 1} has no grade code - type one (e.g. A1) or delete the row.`,
        };
      }
      if (seen.has(grade)) {
        setBadRow(i);
        return { error: `Grade ${grade} appears more than once.` };
      }
      seen.add(grade);
      if (b.minScore < 0 || b.minScore > 100) {
        setBadRow(i);
        return { error: `Row ${i + 1}: min score must be between 0 and 100.` };
      }
    }
    if (!currentYear || !currentTerm) {
      return { error: "Choose the current academic year and term." };
    }
    setBadRow(null);
    return {
      payload: {
        gradingScale: bands.map(({ b }) => ({
          ...b,
          grade: b.grade.trim(),
          label: (b.label || "").trim(),
        })),
        currentAcademicYear: currentYear,
        currentTerm,
        academicYears: years,
        terms,
        positionBasis,
      },
    };
  };

  useEffect(() => {
    if (collectRef) collectRef.current = collect;
  });

  const handleSave = async () => {
    const { payload, error } = collect();
    if (error || !payload) {
      showToast(error || "Nothing to save", "error");
      return;
    }
    try {
      setSaving(true);
      dirty.current = false;
      await save(payload);
      showToast("Settings saved");
    } catch (e: any) {
      dirty.current = true;
      showToast(e?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const resetScale = () => {
    touch();
    setBadRow(null);
    setScale(DEFAULT_GRADING_SCALE.map((b) => ({ ...b })));
  };

  const addYear = () => {
    const y = newYear.trim();
    if (y && !years.includes(y)) {
      touch();
      setYears((ys) => [...ys, y]);
    }
    setNewYear("");
  };
  const addTermItem = () => {
    const t = newTerm.trim();
    if (t && !terms.includes(t)) {
      touch();
      setTerms((ts) => [...ts, t]);
    }
    setNewTerm("");
  };

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Loading settings…
      </div>
    );

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
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Grading & Academic Configuration
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            These settings drive grading and the current term across the whole
            system
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm disabled:opacity-50"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Academic period */}
      <div
        className="bg-white rounded-xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="font-black text-sm mb-4 flex items-center gap-2"
          style={{ color: "var(--dark-gray)" }}
        >
          <Calendar size={15} style={{ color: "var(--royal-blue)" }} /> Academic
          Period
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Current Academic Year
            </label>
            <select
              value={currentYear}
              onChange={(e) => {
                touch();
                setCurrentYear(e.target.value);
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <input
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addYear()}
                placeholder="e.g. 2025/2026"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border-2 outline-none"
                style={{ borderColor: "var(--medium-gray)" }}
              />
              <button
                onClick={addYear}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "var(--royal-blue)",
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Current Term
            </label>
            <select
              value={currentTerm}
              onChange={(e) => {
                touch();
                setCurrentTerm(e.target.value);
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              {terms.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <input
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTermItem()}
                placeholder="e.g. Term 3"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border-2 outline-none"
                style={{ borderColor: "var(--medium-gray)" }}
              />
              <button
                onClick={addTermItem}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "var(--royal-blue)",
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Class position */}
      <div
        className="bg-white rounded-xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="font-black text-sm mb-1"
          style={{ color: "var(--dark-gray)" }}
        >
          Class Position
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          How positions on report cards are worked out. Students level on the
          chosen measure share a position (1, 2, 2, 4).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {POSITION_OPTIONS.map((o) => {
            const on = positionBasis === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  touch();
                  setPositionBasis(o.value);
                }}
                aria-pressed={on}
                className="text-left p-3 rounded-xl border-2 transition"
                style={{
                  borderColor: on ? "var(--royal-blue)" : "var(--medium-gray)",
                  backgroundColor: on ? "#eef2ff" : "white",
                }}
              >
                <p
                  className="text-sm font-bold"
                  style={{
                    color: on ? "var(--royal-blue)" : "var(--dark-gray)",
                  }}
                >
                  {o.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{o.help}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grading scale */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <h3
            className="font-black text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            Grading Scale (WASSCE)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={resetScale}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ backgroundColor: "#fffbeb", color: "var(--warning)" }}
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={addBand}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "var(--royal-blue)" }}
            >
              <Plus size={12} /> Add Band
            </button>
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
                {["Grade", "Min Score", "Label / Remark", "Points", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {scale.map((b, i) => (
                <tr
                  key={i}
                  style={
                    badRow === i ? { backgroundColor: "#fff1f2" } : undefined
                  }
                >
                  <td className="px-4 py-2">
                    <input
                      value={b.grade}
                      onChange={(e) => setBand(i, "grade", e.target.value)}
                      placeholder="e.g. A1"
                      className="w-16 px-2 py-1.5 text-sm font-bold rounded-lg border-2 outline-none"
                      style={{
                        borderColor:
                          badRow === i && !b.grade.trim()
                            ? "var(--accent-red)"
                            : "var(--medium-gray)",
                      }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={b.minScore}
                      onChange={(e) => setBand(i, "minScore", e.target.value)}
                      className="w-20 px-2 py-1.5 text-sm rounded-lg border-2 outline-none"
                      style={{ borderColor: "var(--medium-gray)" }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={b.label}
                      onChange={(e) => setBand(i, "label", e.target.value)}
                      className="w-full px-2 py-1.5 text-sm rounded-lg border-2 outline-none"
                      style={{ borderColor: "var(--medium-gray)" }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={b.points}
                      onChange={(e) => setBand(i, "points", e.target.value)}
                      className="w-16 px-2 py-1.5 text-sm rounded-lg border-2 outline-none"
                      style={{ borderColor: "var(--medium-gray)" }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeBand(i)}
                      className="p-1.5 rounded-lg hover:bg-red-50"
                      style={{ color: "var(--accent-red)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="flex items-start gap-3 p-4 text-xs border-t"
          style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
        >
          <Info
            size={15}
            style={{ color: "var(--royal-blue)" }}
            className="flex-shrink-0 mt-0.5"
          />
          <p style={{ color: "#1e40af" }}>
            A score is assigned the highest band whose{" "}
            <strong>min score</strong> it meets. <strong>Points</strong> feed
            the aggregate (best six, lower is better). Changes apply to{" "}
            <strong>newly entered</strong> scores; existing scores keep their
            grade until re-saved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradingConfig;
