import { ApiError } from "./errors";

/** Base URL pública del API (sin barra final). Vacío = rutas relativas al origin del dev server. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const base = typeof raw === "string" ? raw.trim() : "";
  return base.replace(/\/$/, "");
}

export function buildApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${normalized}` : normalized;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildApiUrl(path);
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("Error de red. Comprobá tu conexión.", "NETWORK");
  }
  if (!res.ok) {
    throw new ApiError(`La solicitud falló (${res.status}).`, "HTTP", res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("Respuesta inválida.", "PARSE");
  }
}
