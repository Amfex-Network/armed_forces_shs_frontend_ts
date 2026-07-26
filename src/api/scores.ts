import { api } from "./client";

export interface PopulatedStudent {
  _id: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  formClass?: string;
}

export interface Score {
  id?: string;
  _id?: string;
  student: string | PopulatedStudent;
  subject: string;
  academicYear: string;
  term: string;
  formClass?: string;
  classScore?: number;
  examScore?: number;
  total?: number;
  grade?: string;
  remark?: string;
  [key: string]: unknown;
}

export interface ScoreQuery {
  student?: string;
  subject?: string;
  academicYear?: string;
  term?: string;
  formClass?: string;
}

function toUi(s: Score): Score {
  return { ...s, id: s._id };
}

function toApi(s: Partial<Score>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...s };
  delete rest.id;
  delete rest._id;
  return rest;
}

function toQuery(q?: ScoreQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const scoresApi = {
  async list(query?: ScoreQuery): Promise<Score[]> {
    const res = await api.get<{ success: boolean; items: Score[] }>(
      `/api/scores${toQuery(query)}`,
    );
    return res.items.map(toUi);
  },
  async create(payload: Partial<Score>): Promise<Score> {
    const res = await api.post<{ success: boolean; item: Score }>(
      "/api/scores",
      toApi(payload),
    );
    return toUi(res.item);
  },
  async update(id: string, payload: Partial<Score>): Promise<Score> {
    const res = await api.put<{ success: boolean; item: Score }>(
      `/api/scores/${id}`,
      toApi(payload),
    );
    return toUi(res.item);
  },
  remove(id: string) {
    return api.del<{ success: boolean; message: string }>(`/api/scores/${id}`);
  },
};
