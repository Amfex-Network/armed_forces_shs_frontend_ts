import { api } from "./client";

export interface HasId {
  id?: string;
  _id?: string;
  [key: string]: unknown;
}

function toUi<T extends HasId>(item: T): T {
  return { ...item, id: item._id };
}

function toApi<T extends HasId>(item: Partial<T>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...item };
  delete rest.id;
  delete rest._id;
  return rest;
}

export function createResource<T extends HasId>(base: string) {
  return {
    async list(): Promise<T[]> {
      const res = await api.get<{ success: boolean; items: T[] }>(base);
      return res.items.map(toUi);
    },
    async get(id: string): Promise<T> {
      const res = await api.get<{ success: boolean; item: T }>(`${base}/${id}`);
      return toUi(res.item);
    },
    async create(payload: Partial<T>): Promise<T> {
      const res = await api.post<{ success: boolean; item: T }>(
        base,
        toApi(payload),
      );
      return toUi(res.item);
    },
    async update(id: string, payload: Partial<T>): Promise<T> {
      const res = await api.put<{ success: boolean; item: T }>(
        `${base}/${id}`,
        toApi(payload),
      );
      return toUi(res.item);
    },
    remove(id: string) {
      return api.del<{ success: boolean; message: string }>(`${base}/${id}`);
    },
  };
}
