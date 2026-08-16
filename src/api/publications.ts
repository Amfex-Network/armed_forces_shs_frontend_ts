import { api } from "./client";

export interface Publication {
  id?: string;
  _id?: string;
  formClass: string;
  academicYear: string;
  term: string;
  published: boolean;
  publishedAt?: string | null;
  [key: string]: unknown;
}

export interface PublicationQuery {
  formClass?: string;
  academicYear?: string;
  term?: string;
}

function toUi(p: Publication): Publication {
  return { ...p, id: p._id };
}

function toQuery(q?: PublicationQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const publicationsApi = {
  async list(query?: PublicationQuery): Promise<Publication[]> {
    const res = await api.get<{ success: boolean; items: Publication[] }>(
      `/api/publications${toQuery(query)}`,
    );
    return res.items.map(toUi);
  },
  async set(payload: {
    formClass: string;
    academicYear: string;
    term: string;
    published: boolean;
  }): Promise<Publication> {
    const res = await api.post<{ success: boolean; item: Publication }>(
      "/api/publications",
      payload,
    );
    return toUi(res.item);
  },
};
