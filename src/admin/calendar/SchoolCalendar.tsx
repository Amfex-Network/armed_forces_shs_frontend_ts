// src/admin/calendar/SchoolCalendar.jsx
import React, { useEffect, useState } from "react";
import { calendarApi } from "../../api/calendar";
import { useConfirm } from "../../components/common/ConfirmDialog";
import { useSettings } from "../../context/SettingsContext";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  X,
  Save,
  Trash2,
  Edit3,
} from "lucide-react";

const EVENT_TYPES = {
  term: { color: "var(--warning)", bg: "#fffbeb", label: "Term Date" },
  exam: { color: "var(--accent-red)", bg: "#fff1f2", label: "Examination" },
  holiday: { color: "var(--success-dark)", bg: "#f0fdf4", label: "Holiday" },
  event: { color: "var(--royal-blue)", bg: "#eef2ff", label: "School Event" },
  meeting: { color: "#7c3aed", bg: "#f5f3ff", label: "Meeting" },
};

// "YYYY-MM-DD" as a local calendar date (new Date("YYYY-MM-DD") is UTC
// midnight, which is the previous day west of Greenwich).
const localDate = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const EMPTY_EVENT = { title: "", date: "", time: "", venue: "", type: "event" };

// Declared outside the modal: a component created inside it would be
// re-created on every keystroke and the input would lose focus.
const IField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder = "",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div>
    <label
      className="text-xs font-bold uppercase tracking-wider block mb-1"
      style={{ color: "var(--dark-gray)" }}
    >
      {label}
      {required && <span style={{ color: "var(--accent-red)" }}> *</span>}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
      style={{
        borderColor: error ? "var(--accent-red)" : "var(--medium-gray)",
        color: "var(--dark-gray)",
      }}
    />
    {error && (
      <p className="text-xs mt-1" style={{ color: "var(--accent-red)" }}>
        {error}
      </p>
    )}
  </div>
);

// Modal
const EventModal = ({ event, onSave, onClose }) => {
  const isEdit = !!event?.id;
  const [form, setForm] = useState(event || EMPTY_EVENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!(form.title || "").trim()) e.title = "Required";
    else if (form.title.trim().length > 150)
      e.title = "Keep it under 150 characters";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const ts = EVENT_TYPES[form.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              {isEdit ? <Save size={16} /> : <Plus size={16} />}
            </div>
            <div>
              <p className="font-black">
                {isEdit ? "Edit Event" : "Add New Event"}
              </p>
              <p className="text-blue-200 text-xs">
                {isEdit ? form.date : "Fill in the event details"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-200"
          >
            <X size={20} />
          </button>
        </div>
        <div
          className="h-1 flex-shrink-0"
          style={{ backgroundColor: "var(--accent-red)" }}
        />

        <div className="p-6 space-y-4 overflow-y-auto">
          <IField
            label="Event Title"
            value={form.title}
            onChange={(v) => set("title", v)}
            error={errors.title}
            placeholder="e.g. End of Term Exams"
            required
          />
          <IField
            label="Date"
            value={form.date}
            onChange={(v) => set("date", v)}
            error={errors.date}
            type="date"
            required
          />
          <IField
            label="Time"
            value={form.time}
            onChange={(v) => set("time", v)}
            placeholder="e.g. 08:00, 09:00 to 12:00, or All Day"
          />
          <IField
            label="Venue / Location"
            value={form.venue}
            onChange={(v) => set("venue", v)}
            placeholder="e.g. Main Hall, School Field"
          />

          {/* Type selector */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Event Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(EVENT_TYPES).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("type", key)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all"
                  style={{
                    borderColor:
                      form.type === key ? val.color : "var(--medium-gray)",
                    backgroundColor: form.type === key ? val.bg : "white",
                    color: form.type === key ? val.color : "var(--dark-gray)",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: val.color }}
                  />
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.title && form.date && (
            <div
              className="p-3 rounded-xl border"
              style={{ backgroundColor: ts.bg, borderColor: ts.color + "40" }}
            >
              <p
                className="text-xs font-bold mb-0.5"
                style={{ color: ts.color }}
              >
                Preview
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--dark-gray)" }}
              >
                {form.title}
              </p>
              <div className="flex flex-wrap gap-3 mt-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={10} />
                  {localDate(form.date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {form.time && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={10} /> {form.time}
                  </p>
                )}
                {form.venue && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {form.venue}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
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
            onClick={() => {
              if (validate()) onSave(form);
            }}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AdminCalendar = () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const { settings } = useSettings();
  const confirm = useConfirm();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (day) => {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(
      (e) => e.date === ds && (filterType === "all" || e.type === filterType),
    );
  };

  useEffect(() => {
    calendarApi
      .list()
      .then(setEvents)
      .catch((err) =>
        showToast(err?.message || "Failed to load the calendar", "error"),
      )
      .finally(() => setLoading(false));
  }, []);

  const byDate = (a, b) =>
    a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || "");

  const handleSave = async (form) => {
    const payload = {
      title: form.title.trim(),
      date: form.date,
      type: form.type,
      time: (form.time || "").trim(),
      venue: (form.venue || "").trim(),
    };
    try {
      if (form.id) {
        const saved = await calendarApi.update(form.id, payload);
        setEvents((evs) =>
          evs.map((e) => (e.id === saved.id ? saved : e)).sort(byDate),
        );
        showToast("Event updated");
      } else {
        const saved = await calendarApi.create(payload);
        setEvents((evs) => [...evs, saved].sort(byDate));
        showToast("Event added");
      }
      setShowModal(false);
      setEditEvent(null);
    } catch (err) {
      showToast(err?.message || "Failed to save the event", "error");
    }
  };

  const handleDelete = async (id) => {
    const target = events.find((e) => e.id === id);
    const ok = await confirm({
      title: "Delete this event?",
      message: target ? `${target.title} (${target.date})` : undefined,
    });
    if (!ok) return;
    try {
      await calendarApi.remove(id);
      setEvents((evs) => evs.filter((e) => e.id !== id));
      showToast("Event removed");
    } catch (err) {
      showToast(err?.message || "Failed to delete the event", "error");
    }
  };

  const openForDate = (day) => {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setEditEvent({ ...EMPTY_EVENT, date: ds });
    setShowModal(true);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Dates are compared as YYYY-MM-DD text, so today's events count as
  // upcoming in every timezone.
  const upcomingEvents = events
    .filter(
      (e) =>
        e.date >= todayStr && (filterType === "all" || e.type === filterType),
    )
    .sort(byDate)
    .slice(0, 6);

  return (
    <div className="space-y-6">
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
            School Calendar
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {settings.currentAcademicYear} Academic Year ·{" "}
            {loading ? "loading…" : `${events.length} events`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            ...Object.entries(EVENT_TYPES).map(([k, v]) => ({
              key: k,
              label: v.label,
            })),
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterType(f.key)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              style={{
                backgroundColor:
                  filterType === f.key ? "var(--royal-blue)" : "white",
                color: filterType === f.key ? "white" : "var(--dark-gray)",
                border: "1px solid var(--medium-gray)",
              }}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setEditEvent(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Plus size={15} /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div
          className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {/* Month nav */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{
              borderColor: "var(--medium-gray)",
              backgroundColor: "var(--light-gray)",
            }}
          >
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-200"
            >
              <ChevronLeft size={16} style={{ color: "var(--dark-gray)" }} />
            </button>
            <h2
              className="font-black text-base"
              style={{ color: "var(--dark-gray)" }}
            >
              {MONTHS[month]} {year}
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-200"
            >
              <ChevronRight size={16} style={{ color: "var(--dark-gray)" }} />
            </button>
          </div>

          {/* Day headers */}
          <div
            className="grid grid-cols-7 border-b"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {DAYS.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-bold uppercase text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`e-${i}`}
                className="border-b border-r p-2 min-h-[70px]"
                style={{ borderColor: "var(--medium-gray)" }}
              />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday =
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;
              const isSel = selectedDate === day;
              return (
                <div
                  key={day}
                  className="border-b border-r p-1.5 min-h-[70px] cursor-pointer hover:bg-gray-50 group transition-colors"
                  style={{
                    borderColor: "var(--medium-gray)",
                    backgroundColor: isSel ? "#eef2ff" : undefined,
                  }}
                  onClick={() =>
                    setSelectedDate(day === selectedDate ? null : day)
                  }
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: isToday
                          ? "var(--royal-blue)"
                          : undefined,
                        color: isToday ? "white" : "var(--dark-gray)",
                      }}
                    >
                      {day}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openForDate(day);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full flex items-center justify-center transition-opacity"
                      style={{
                        backgroundColor: "var(--royal-blue)",
                        color: "white",
                      }}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => {
                      const t = EVENT_TYPES[e.type];
                      return (
                        <div
                          key={e.id}
                          className="text-xs px-1 py-0.5 rounded truncate font-medium"
                          style={{ backgroundColor: t.bg, color: t.color }}
                        >
                          {e.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-400 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Selected day */}
          {selectedDate && (
            <div
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{
                  borderColor: "var(--medium-gray)",
                  backgroundColor: "var(--light-gray)",
                }}
              >
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {selectedDate} {MONTHS[month]} {year}
                </h3>
                <button
                  type="button"
                  onClick={() => openForDate(selectedDate)}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              <div
                className="divide-y"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                {selectedEvents.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">
                    No events - click Add to create one
                  </p>
                ) : (
                  selectedEvents.map((e) => {
                    const t = EVENT_TYPES[e.type];
                    return (
                      <div key={e.id} className="p-3">
                        <div className="flex items-start gap-2">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: t.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "var(--dark-gray)" }}
                            >
                              {e.title}
                            </p>
                            {e.time && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock size={10} /> {e.time}
                              </p>
                            )}
                            {e.venue && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin size={10} /> {e.venue}
                              </p>
                            )}
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-semibold mt-1 inline-block"
                              style={{ backgroundColor: t.bg, color: t.color }}
                            >
                              {t.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditEvent(e);
                                setShowModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-yellow-50"
                              style={{ color: "var(--warning)" }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(e.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50"
                              style={{ color: "var(--accent-red)" }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "var(--light-gray)",
              }}
            >
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--dark-gray)" }}
              >
                Upcoming Events
              </h3>
            </div>
            <div
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">
                  No upcoming events
                </p>
              ) : (
                upcomingEvents.map((e) => {
                  const t = EVENT_TYPES[e.type];
                  const d = localDate(e.date);
                  return (
                    <div key={e.id} className="flex items-start gap-3 p-3">
                      <div
                        className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                        style={{ backgroundColor: t.color }}
                      >
                        <span className="text-xs font-black leading-none">
                          {d.getDate()}
                        </span>
                        <span className="text-xs leading-none opacity-80">
                          {MONTHS[d.getMonth()].slice(0, 3)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {e.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {e.time}
                          {e.venue ? ` · ${e.venue}` : ""}
                        </p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{ backgroundColor: t.bg, color: t.color }}
                        >
                          {t.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditEvent(e);
                          setShowModal(true);
                        }}
                        className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                        style={{ color: "var(--warning)" }}
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div
            className="bg-white rounded-xl border shadow-sm p-4"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--dark-gray)", opacity: 0.5 }}
            >
              Legend
            </p>
            <div className="space-y-2">
              {Object.entries(EVENT_TYPES).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: val.color }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {val.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EventModal
          event={editEvent}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditEvent(null);
          }}
        />
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default AdminCalendar;
