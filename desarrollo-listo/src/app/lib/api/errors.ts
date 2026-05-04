export type ApiErrorCode = "NETWORK" | "HTTP" | "PARSE";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Mensaje seguro para mostrar en UI; no incluye cuerpos crudos de 5xx. */
export function toUserSafeMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  return "No se pudo completar la operación.";
}
