import React, { useEffect, useMemo, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  timetableApi,
  TimetableSlot,
  TIMETABLE_DAYS,
} from "../../api/timetable";
import { useDayPeriods } from "../../hooks/useDayPeriods";

const StudentTimetable = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const { rows } = useDayPeriods();

  useEffect(() => {
    timetableApi
      .list()
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  const byKey = useMemo(() => {
    const map: Record<string, TimetableSlot> = {};
    slots.forEach((s) => {
      map[`${s.day}-${s.period}`] = s;
    });
    return map;
  }, [slots]);

  const today = TIMETABLE_DAYS[new Date().getDay() - 1] || "Monday";

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Loading timetable…
      </div>
    );

  const empty = slots.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            My Timetable
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {user?.formClass || "Your class"} weekly schedule
          </p>
        </div>
      </div>

      {empty ? (
        <div
          className="bg-white rounded-xl border shadow-sm py-16 text-center"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <Clock size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-400">
            No timetable has been published for your class yet.
          </p>
        </div>
      ) : (
        <>
          {/* Day picker (mobile) */}
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {TIMETABLE_DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap"
                style={{
                  backgroundColor:
                    selectedDay === d ? "var(--royal-blue)" : "white",
                  color: selectedDay === d ? "white" : "var(--dark-gray)",
                  border: "1px solid var(--medium-gray)",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Mobile: single-day list */}
          <div className="lg:hidden space-y-2">
            {rows.map((p, i) => {
              const slot = byKey[`${selectedDay}-${p.lesson}`];
              if (p.isBreak)
                return (
                  <div
                    key={i}
                    className="text-center text-xs font-semibold py-1.5 rounded-lg"
                    style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                  >
                    {p.label} · {p.time}
                  </div>
                );
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border p-3 flex items-center gap-3 shadow-sm"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <div className="text-xs text-gray-400 w-20 flex-shrink-0">
                    {p.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {slot?.subject || "-"}
                    </p>
                    {slot && (
                      <p className="text-xs text-gray-400 truncate">
                        {slot.teacher}
                        {slot.room ? ` · ${slot.room}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: full week grid */}
          <div
            className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-x-auto"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr style={{ backgroundColor: "var(--light-gray)" }}>
                  <th className="px-3 py-3 text-left text-xs font-black uppercase text-gray-500 w-32">
                    Period
                  </th>
                  {TIMETABLE_DAYS.map((d) => (
                    <th
                      key={d}
                      className="px-3 py-3 text-center text-xs font-black uppercase"
                      style={{
                        color:
                          d === today
                            ? "var(--royal-blue)"
                            : "var(--dark-gray)",
                      }}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => {
                  if (p.isBreak)
                    return (
                      <tr key={i}>
                        <td
                          colSpan={TIMETABLE_DAYS.length + 1}
                          className="px-3 py-1.5 text-center text-xs font-semibold"
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                          }}
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
                        const slot = byKey[`${d}-${p.lesson}`];
                        return (
                          <td key={d} className="px-2 py-2 text-center">
                            {slot ? (
                              <div
                                className="rounded-lg px-2 py-1.5"
                                style={{
                                  backgroundColor: "#eef2ff",
                                }}
                              >
                                <p
                                  className="text-xs font-bold truncate"
                                  style={{ color: "var(--royal-blue)" }}
                                >
                                  {slot.subject}
                                </p>
                                {slot.room && (
                                  <p className="text-xs text-gray-400">
                                    {slot.room}
                                  </p>
                                )}
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
        </>
      )}

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <RefreshCw size={11} /> Timetable is maintained by your teachers and the
        admin office.
      </p>
    </div>
  );
};

export default StudentTimetable;
