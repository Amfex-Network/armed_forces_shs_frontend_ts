// The API is always called on this site's own origin: Vite proxies /api in
// development and Vercel rewrites /api to the backend in production. The
// session therefore lives in a first-party HttpOnly cookie that page scripts
// cannot read, and no token is ever stored in the browser.
const BASE_URL = "";

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  code?: string;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code =
      data && typeof data === "object" && "code" in data
        ? String((data as { code: unknown }).code)
        : undefined;
  }
}

// Fired so the auth layer can react wherever the request was made.
export const AUTH_EVENTS = {
  expired: "afshs:session-expired",
  passwordChange: "afshs:password-change-required",
};

type Body = Record<string, unknown> | undefined;

async function request<T>(
  method: string,
  path: string,
  body?: Body,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: "same-origin",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Check your internet connection and try again.",
      0,
      null,
    );
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) || `Request failed (${res.status})`;
    const error = new ApiError(message, res.status, data);
    const isSessionCheck = path.startsWith("/api/auth/");
    if (error.code === "NOT_AUTHENTICATED" && !isSessionCheck) {
      window.dispatchEvent(new Event(AUTH_EVENTS.expired));
    }
    if (error.code === "PASSWORD_CHANGE_REQUIRED") {
      window.dispatchEvent(new Event(AUTH_EVENTS.passwordChange));
    }
    throw error;
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: Body) => request<T>("POST", path, body),
  put: <T>(path: string, body?: Body) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};
