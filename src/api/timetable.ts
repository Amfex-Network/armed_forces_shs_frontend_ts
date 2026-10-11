import { api } from "./client";

export interface TimetableSlot {
  id?: string;
  _id?: string;
  formClass: string;
  day: string;
  period: number;
  subject: string;
  teacher?: string;
  room?: string;
  [key: string]: unknown;
}

export interface TimetableQuery {
  formClass?: string;
  day?: string;
}

function toUi(s: TimetableSlot): TimetableSlot {
  return { ...s, id: s._id };
}

function toQuery(q?: TimetableQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const timetableApi = {
  async list(query?: TimetableQuery): Promise<TimetableSlot[]> {
    const res = await api.get<{ success: boolean; items: TimetableSlot[] }>(
      `/api/timetable${toQuery(query)}`,
    );
    return res.items.map(toUi);
  },
  async save(payload: {
    formClass: string;
    day: string;
    period: number;
    subject: string;
    teacher?: string;
    room?: string;
  }): Promise<TimetableSlot> {
    const res = await api.post<{ success: boolean; item: TimetableSlot }>(
      "/api/timetable",
      payload,
    );
    return toUi(res.item);
  },
  remove(id: string) {
    return api.del<{ success: boolean; message: string }>(
      `/api/timetable/${id}`,
    );
  },
};

export const TIMETABLE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export type PeriodKind = "lesson" | "break" | "lunch";

export interface DayPeriod {
  kind: PeriodKind;
  label: string;
  start: string;
  end: string;
}

// One row of the school day as shown on a timetable. Lessons are numbered
// in order; a timetable slot's period is that number.
export interface PeriodRow {
  label: string;
  time: string;
  isBreak: boolean;
  lesson?: number;
}

export const DEFAULT_DAY_PERIODS: DayPeriod[] = [
  { kind: "lesson", label: "", start: "07:30", end: "08:20" },
  { kind: "lesson", label: "", start: "08:20", end: "09:10" },
  { kind: "lesson", label: "", start: "09:10", end: "10:00" },
  { kind: "break", label: "Break", start: "10:00", end: "10:20" },
  { kind: "lesson", label: "", start: "10:20", end: "11:10" },
  { kind: "lesson", label: "", start: "11:10", end: "12:00" },
  { kind: "lesson", label: "", start: "12:00", end: "12:50" },
  { kind: "lunch", label: "Lunch", start: "12:50", end: "13:30" },
  { kind: "lesson", label: "", start: "13:30", end: "14:20" },
  { kind: "lesson", label: "", start: "14:20", end: "15:10" },
];

export const toPeriodRows = (periods: DayPeriod[]): PeriodRow[] => {
  let lesson = 0;
  return periods.map((p) => {
    const time = `${p.start}-${p.end}`;
    if (p.kind !== "lesson") {
      return {
        label: p.label || (p.kind === "lunch" ? "Lunch" : "Break"),
        time,
        isBreak: true,
      };
    }
    lesson += 1;
    return { label: `Period ${lesson}`, time, isBreak: false, lesson };
  });
};

export const periodsApi = {
  async get(): Promise<DayPeriod[]> {
    const res = await api.get<{ success: boolean; periods: DayPeriod[] }>(
      "/api/timetable/periods",
    );
    return res.periods;
  },
  async save(periods: DayPeriod[]): Promise<DayPeriod[]> {
    const res = await api.put<{ success: boolean; periods: DayPeriod[] }>(
      "/api/timetable/periods",
      { periods },
    );
    return res.periods;
  },
};
