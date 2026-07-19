// src/admin/calendar/SchoolCalendar.jsx
import React, { useState } from "react";
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
  term: { color: "var(--warning)", bg: "#fffbeb", label: "Semester Date" },
  exam: { color: "var(--accent-red)", bg: "#fff1f2", label: "Examination" },
  holiday: { color: "var(--success-dark)", bg: "#f0fdf4", label: "Holiday" },
  event: { color: "var(--royal-blue)", bg: "#eef2ff", label: "School Event" },
  meeting: { color: "#7c3aed", bg: "#f5f3ff", label: "Meeting" },
};

const INITIAL_EVENTS = [
  {
    id: 1,
    date: "2025-01-06",
    title: "Semester 1 Begins",
    type: "term",
    time: "07:00",
    venue: "School Grounds",
  },
  {
    id: 2,
    date: "2025-01-20",
    title: "Parent-Teacher Conference",
    type: "meeting",
    time: "09:00–15:00",
    venue: "Main Hall",
  },
  {
    id: 3,
    date: "2025-02-14",
    title: "Founders' Day (Public Holiday)",
    type: "holiday",
    time: "All Day",
    venue: "",
  },
  {
    id: 4,
    date: "2025-02-21",
    title: "Inter-House Sports Day",
    type: "event",
    time: "07:30",
    venue: "School Field",
  },
  {
    id: 5,
    date: "2025-03-06",
    title: "Independence Day (Holiday)",
    type: "holiday",
    time: "All Day",
    venue: "",
  },
  {
    id: 6,
    date: "2025-03-17",
    title: "HOD Meeting — Semester 1 Review",
    type: "meeting",
    time: "10:00",
    venue: "Conference Room",
  },
  {
    id: 7,
    date: "2025-03-24",
    title: "Semester 1 Exams Begin",
    type: "exam",
    time: "08:00",
    venue: "Exam Halls A, B, C",
  },
  {
    id: 8,
    date: "2025-04-04",
    title: "Semester 1 Exams End",
    type: "exam",
    time: "16:00",
    venue: "Exam Halls A, B, C",
  },
  {
    id: 9,
    date: "2025-04-11",
    title: "Semester 1 Ends",
    type: "term",
    time: "12:00",
    venue: "School Grounds",
  },
  {
    id: 10,
    date: "2025-04-14",
    title: "Semester 2 Begins",
    type: "term",
    time: "07:00",
    venue: "School Grounds",
  },
  {
    id: 11,
    date: "2025-04-18",
    title: "Good Friday (Holiday)",
    type: "holiday",
    time: "All Day",
    venue: "",
  },
  {
    id: 12,
    date: "2025-04-21",
    title: "Easter Monday (Holiday)",
    type: "holiday",
    time: "All Day",
    venue: "",
  },
  {
    id: 13,
    date: "2025-05-01",
    title: "Workers' Day (Holiday)",
    type: "holiday",
    time: "All Day",
    venue: "",
  },
  {
    id: 14,
    date: "2025-05-12",
    title: "WASSCE Begins",
    type: "exam",
    time: "08:30",
    venue: "AFSHTS Centre GH0042",
  },
  {
    id: 15,
    date: "2025-06-13",
    title: "Semester 2 Exams Begin",
    type: "exam",
    time: "08:00",
    venue: "Exam Halls A, B, C",
  },
  {
    id: 16,
    date: "2025-07-04",
    title: "Graduation Ceremony — Form 3",
    type: "event",
    time: "10:00",
    venue: "Main Hall",
  },
  {
    id: 17,
    date: "2025-07-25",
    title: "Semester 2 Ends",
    type: "term",
    time: "12:00",
    venue: "School Grounds",
  },
];

const EMPTY_EVENT = { title: "", date: "", time: "", venue: "", type: "event" };

// ─── Modal ─────────────────────────────────────────────────────────────────────
const EventModal = ({ event, onSave, onClose }) => {
  const isEdit = !!event?.id;
  const [form, setForm] = useState(event || EMPTY_EVENT);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const ts = EVENT_TYPES[form.type];

  const IField = ({ label, field, type = "text", placeholder, required }) => (
    <div>
      <label
        className="text-xs font-bold uppercase tracking-wider block mb-1.5"
        style={{ color: "var(--dark-gray)" }}
      >
        {label}
        {required && <span style={{ color: "var(--accent-red)" }}> *</span>}
      </label>
      <input
        type={type}
        value={form[field] || ""}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
        style={{
          borderColor: errors[field]
            ? "var(--accent-red)"
            : "var(--medium-gray)",
          color: "var(--dark-gray)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
        onBlur={(e) =>
          (e.target.style.borderColor = errors[field]
            ? "var(--accent-red)"
            : "var(--medium-gray)")
        }
      />
      {errors[field] && (
        <p className="text-xs mt-1" style={{ color: "var(--accent-red)" }}>
          {errors[field]}
        </p>
      )}
    </div>
  );

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
            field="title"
            placeholder="e.g. End of Semester Exams"
            required
          />
          <IField label="Date" field="date" type="date" required />
          <IField
            label="Time"
            field="time"
            placeholder="e.g. 08:00 or 09:00–12:00 or All Day"
          />
          <IField
            label="Venue / Location"
            field="venue"
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
                  {new Date(form.date).toLocaleDateString("en-GB", {
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

// ─── Main ─────────────────────────────────────────────────────────────────────
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
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
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

  const handleSave = (form) => {
    if (form.id) {
      setEvents((evs) => evs.map((e) => (e.id === form.id ? form : e)));
      showToast("Event updated");
    } else {
      setEvents((evs) => [...evs, { ...form, id: Date.now() }]);
      showToast("Event added");
    }
    setShowModal(false);
    setEditEvent(null);
  };

  const handleDelete = (id) => {
    setEvents((evs) => evs.filter((e) => e.id !== id));
    showToast("Event removed", "error");
  };

  const openForDate = (day) => {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setEditEvent({ ...EMPTY_EVENT, date: ds });
    setShowModal(true);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const upcomingEvents = events
    .filter(
      (e) =>
        new Date(e.date) >= today &&
        (filterType === "all" || e.type === filterType),
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
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
            2024/2025 Academic Year · {events.length} events
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
                    No events — click Add to create one
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
                  const d = new Date(e.date);
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
