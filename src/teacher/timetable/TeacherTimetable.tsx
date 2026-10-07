import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { classesApi, subjectsApi } from "../../api/domains";
import {
  timetableApi,
  TimetableSlot,
  TIMETABLE_DAYS,
  TIMETABLE_PERIODS,
} from "../../api/timetable";
import { useConfirm } from "../../components/common/ConfirmDialog";

const TEACHING_PERIODS = TIMETABLE_PERIODS.map((p, i) => ({
  ...p,
  index: i,
})).filter((p) => !(p as any).isBreak);

const TeacherTimetable = () => {
  const confirm = useConfirm();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [day, setDay] = useState("Monday");
  const [period, setPeriod] = useState(TEACHING_PERIODS[0].index);
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const [cls, subs] = await Promise.all([
          classesApi.list(),
          subjectsApi.list().catch(() => []),
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

  const loadSlots = async (formClass: string) => {
    try {
      setSlots(await timetableApi.list({ formClass }));
    } catch {
      setSlots([]);
    }
  };

  useEffect(() => {
    if (selectedClass) loadSlots(selectedClass.name);
    else setSlots([]);
  }, [selectedClass]);

  const byKey = useMemo(() => {
    const map: Record<string, TimetableSlot> = {};
    slots.forEach((s) => {
      map[`${s.day}-${s.period}`] = s;
    });
    return map;
  }, [slots]);

  const handleSave = async () => {
    if (!selectedClass || !subject.trim()) {
      showToast("Pick a class and subject", "error");
      return;
    }
    try {
      setSaving(true);
      const saved = await timetableApi.save({
        formClass: selectedClass.name,
        day,
        period,
        subject,
        teacher: teacher || undefined,
        room: room || undefined,
      });
      setSlots((ss) => {
        const rest = ss.filter((s) => !(s.day === day && s.period === period));
        return [...rest, saved];
      });
      showToast("Slot saved");
    } catch (err: any) {
      showToast(err?.message || "Failed to save slot", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slot: TimetableSlot) => {
    const ok = await confirm({
      title: "Remove this lesson?",
      message: `${slot.day} · period ${slot.period} · ${slot.subject}`,
    });
    if (!ok) return;
    try {
      await timetableApi.remove(slot.id as string);
      setSlots((ss) => ss.filter((s) => s.id !== slot.id));
      showToast("Slot removed", "error");
    } catch (err: any) {
      showToast(err?.message || "Failed to remove slot", "error");
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">Loading…</div>
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
            Class Timetable
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Build and maintain the weekly schedule for a class
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedClass?.id || ""}
            onChange={(e) =>
              setSelectedClass(
                classes.find((c) => c.id === e.target.value) || null,
              )
            }
            className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
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
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--royal-blue)" }}
          />
        </div>
      </div>

      {/* Add / update slot */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <p
          className="text-xs font-black uppercase tracking-wider mb-3"
          style={{ color: "var(--dark-gray)" }}
        >
          Add / Update Slot
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="px-2 py-2 text-sm rounded-lg border-2 outline-none bg-white"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {TIMETABLE_DAYS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-2 py-2 text-sm rounded-lg border-2 outline-none bg-white"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {TEACHING_PERIODS.map((p) => (
              <option key={p.index} value={p.index}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-2 py-2 text-sm rounded-lg border-2 outline-none bg-white"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {subjects.length === 0 && <option value="">No subjects</option>}
            {subjects.map((s) => (
              <option key={s.id || s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            placeholder="Teacher (optional)"
            className="px-2 py-2 text-sm rounded-lg border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room (optional)"
            className="px-2 py-2 text-sm rounded-lg border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !selectedClass}
          className="mt-3 flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={14} /> {saving ? "Saving…" : "Save Slot"}
        </button>
      </div>

      {/* Week grid */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-x-auto"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr style={{ backgroundColor: "var(--light-gray)" }}>
              <th className="px-3 py-3 text-left text-xs font-black uppercase text-gray-500 w-28">
                Period
              </th>
              {TIMETABLE_DAYS.map((d) => (
                <th
                  key={d}
                  className="px-3 py-3 text-center text-xs font-black uppercase text-gray-500"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE_PERIODS.map((p, i) => {
              if ((p as any).isBreak)
                return (
                  <tr key={i}>
                    <td
                      colSpan={TIMETABLE_DAYS.length + 1}
                      className="px-3 py-1.5 text-center text-xs font-semibold"
                      style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                    >
                      {p.label} · {p.time}
                    </td>
                  </tr>
                );
              return (
                <tr
                  key={i}
                  className="border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <td className="px-3 py-2">
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {p.label}
                    </p>
                    <p className="text-xs text-gray-400">{p.time}</p>
                  </td>
                  {TIMETABLE_DAYS.map((d) => {
                    const slot = byKey[`${d}-${i}`];
                    return (
                      <td key={d} className="px-2 py-2 text-center align-top">
                        {slot ? (
                          <div
                            className="rounded-lg px-2 py-1.5 relative group"
                            style={{ backgroundColor: "#eef2ff" }}
                          >
                            <p
                              className="text-xs font-bold truncate"
                              style={{ color: "var(--royal-blue)" }}
                            >
                              {slot.subject}
                            </p>
                            {(slot.teacher || slot.room) && (
                              <p className="text-xs text-gray-400 truncate">
                                {slot.teacher}
                                {slot.room ? ` · ${slot.room}` : ""}
                              </p>
                            )}
                            <button
                              onClick={() => handleDelete(slot)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              style={{ borderColor: "var(--medium-gray)" }}
                              title="Remove"
                            >
                              <Trash2
                                size={11}
                                style={{ color: "var(--accent-red)" }}
                              />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <Clock size={11} /> Students in the selected class see this schedule in
        their portal.
      </p>
    </div>
  );
};

export default TeacherTimetable;
