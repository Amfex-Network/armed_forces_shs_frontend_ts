import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import {
  calendarApi,
  type CalendarEvent,
  type CalendarEventType,
} from "../../api/calendar";

const TYPE_STYLE: Record<
  CalendarEventType,
  { color: string; bg: string; label: string }
> = {
  term: { color: "var(--warning)", bg: "#fffbeb", label: "Term Date" },
  exam: { color: "var(--accent-red)", bg: "#fff1f2", label: "Examination" },
  holiday: { color: "var(--success-dark)", bg: "#f0fdf4", label: "Holiday" },
  event: { color: "var(--royal-blue)", bg: "#eef2ff", label: "School Event" },
  meeting: { color: "#7c3aed", bg: "#f5f3ff", label: "Meeting" },
};

const MAX_SHOWN = 5;

// Local "YYYY-MM-DD"; event dates are stored the same way.
const todayYmd = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// The next few school-calendar events, for the admin and teacher
// dashboards. manageTo links to the calendar for users who may edit it.
export const UpcomingEvents = ({ manageTo }: { manageTo?: string }) => {
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);

  useEffect(() => {
    const today = todayYmd();
    calendarApi
      .list()
      .then((all) =>
        setEvents(
          all
            .filter((e) => e.date >= today)
            .sort(
              (a, b) =>
                a.date.localeCompare(b.date) ||
                (a.time || "").localeCompare(b.time || ""),
            )
            .slice(0, MAX_SHOWN),
        ),
      )
      .catch(() => setEvents([]));
  }, []);

  return (
    <div
      className="bg-white rounded-xl border shadow-sm p-5"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="font-semibold text-sm flex items-center gap-2"
          style={{ color: "var(--dark-gray)" }}
        >
          <CalendarDays size={15} style={{ color: "var(--royal-blue)" }} />
          Upcoming Events
        </h3>
        {manageTo && (
          <Link
            to={manageTo}
            className="text-xs font-semibold"
            style={{ color: "var(--royal-blue)" }}
          >
            Manage events
          </Link>
        )}
      </div>
      {events === null ? (
        <p className="text-xs text-gray-400">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-xs text-gray-500">
          Nothing scheduled on the school calendar.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => {
            const t = TYPE_STYLE[e.type] || TYPE_STYLE.event;
            const d = new Date(`${e.date}T00:00:00`);
            return (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-lg p-2"
                style={{ backgroundColor: t.bg }}
              >
                <div
                  className="w-11 flex-shrink-0 text-center rounded-md bg-white py-1"
                  style={{ color: t.color }}
                >
                  <p className="text-sm font-black leading-none">
                    {d.getDate()}
                  </p>
                  <p className="text-[10px] uppercase font-semibold">
                    {d.toLocaleDateString("en-GB", { month: "short" })}
                  </p>
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {e.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {[
                      t.label,
                      d.toLocaleDateString("en-GB", { weekday: "short" }),
                      e.time,
                      e.venue,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
