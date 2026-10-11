import { api } from "./client";

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  status: string;
  ip?: string;
}

interface ApiAuditLog {
  _id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  module: string;
  details: string;
  status: string;
  ip?: string;
  date: string;
}

export interface AuditQuery {
  module?: string;
  status?: string;
  role?: string;
  actor?: string;
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
  skip?: number;
}

function fmt(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function toUi(l: ApiAuditLog): AuditEntry {
  return {
    id: l._id,
    timestamp: fmt(l.date),
    user: l.actorEmail,
    role: l.actorRole,
    action: l.action,
    module: l.module,
    details: l.details,
    status: l.status,
    ip: l.ip,
  };
}

function toQuery(q?: AuditQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const auditApi = {
  async list(
    query?: AuditQuery,
  ): Promise<{ items: AuditEntry[]; total: number; modules: string[] }> {
    const res = await api.get<{
      success: boolean;
      items: ApiAuditLog[];
      total: number;
      modules?: string[];
    }>(`/api/audit-logs${toQuery(query)}`);
    return {
      items: res.items.map(toUi),
      total: res.total,
      modules: res.modules || [],
    };
  },

  // Every entry matching the filters, fetched page by page (for export).
  async listAll(
    query: AuditQuery,
    max = 20000,
  ): Promise<{ items: AuditEntry[]; total: number }> {
    const items: AuditEntry[] = [];
    let total = 0;
    do {
      const page = await this.list({
        ...query,
        limit: 500,
        skip: items.length,
      });
      total = page.total;
      items.push(...page.items);
      if (page.items.length === 0) break;
    } while (items.length < Math.min(total, max));
    return { items, total };
  },
};
