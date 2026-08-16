import { api } from "./client";

export interface StudentComment {
  id?: string;
  _id?: string;
  student: string | { _id: string; firstName?: string; lastName?: string };
  academicYear: string;
  term: string;
  formClass?: string;
  formTeacherComment?: string;
  headComment?: string;
  conduct?: string;
  interest?: string;
  attitude?: string;
  [key: string]: unknown;
}

export interface CommentQuery {
  student?: string;
  academicYear?: string;
  term?: string;
  formClass?: string;
}

function toUi(c: StudentComment): StudentComment {
  return { ...c, id: c._id };
}

function toApi(c: Partial<StudentComment>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...c };
  delete rest.id;
  delete rest._id;
  return rest;
}

function toQuery(q?: CommentQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const commentsApi = {
  async list(query?: CommentQuery): Promise<StudentComment[]> {
    const res = await api.get<{ success: boolean; items: StudentComment[] }>(
      `/api/comments${toQuery(query)}`,
    );
    return res.items.map(toUi);
  },
  async save(payload: Partial<StudentComment>): Promise<StudentComment> {
    const res = await api.post<{ success: boolean; item: StudentComment }>(
      "/api/comments",
      toApi(payload),
    );
    return toUi(res.item);
  },
  remove(id: string) {
    return api.del<{ success: boolean; message: string }>(
      `/api/comments/${id}`,
    );
  },
};
