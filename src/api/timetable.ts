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

export const TIMETABLE_PERIODS = [
  { label: "Period 1", time: "07:30–08:20" },
  { label: "Period 2", time: "08:20–09:10" },
  { label: "Period 3", time: "09:10–10:00" },
  { label: "Break", time: "10:00–10:20", isBreak: true },
  { label: "Period 4", time: "10:20–11:10" },
  { label: "Period 5", time: "11:10–12:00" },
  { label: "Period 6", time: "12:00–12:50" },
  { label: "Lunch", time: "12:50–13:30", isBreak: true },
  { label: "Period 7", time: "13:30–14:20" },
  { label: "Period 8", time: "14:20–15:10" },
];
