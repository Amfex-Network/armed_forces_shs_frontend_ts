import { api } from "./client";

export interface AttendanceRecord {
  id?: string;
  _id?: string;
  student: string | { _id: string; firstName?: string; lastName?: string };
  date: string;
  status: string;
  formClass?: string;
  term?: string;
  academicYear?: string;
  note?: string;
  [key: string]: unknown;
}

export interface AttendanceQuery {
  student?: string;
  date?: string;
  formClass?: string;
  term?: string;
  academicYear?: string;
}

function toUi(a: AttendanceRecord): AttendanceRecord {
  return { ...a, id: a._id };
}

function toApi(a: Partial<AttendanceRecord>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...a };
  delete rest.id;
  delete rest._id;
  return rest;
}

function toQuery(q?: AttendanceQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const attendanceApi = {
  async list(query?: AttendanceQuery): Promise<AttendanceRecord[]> {
    const res = await api.get<{ success: boolean; items: AttendanceRecord[] }>(
      `/api/attendance${toQuery(query)}`,
    );
    return res.items.map(toUi);
  },
  async create(payload: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const res = await api.post<{ success: boolean; item: AttendanceRecord }>(
      "/api/attendance",
      toApi(payload),
    );
    return toUi(res.item);
  },
  async update(
    id: string,
    payload: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> {
    const res = await api.put<{ success: boolean; item: AttendanceRecord }>(
      `/api/attendance/${id}`,
      toApi(payload),
    );
    return toUi(res.item);
  },
  remove(id: string) {
    return api.del<{ success: boolean; message: string }>(
      `/api/attendance/${id}`,
    );
  },
};
