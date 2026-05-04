import { requestJson } from "./client";

export type HealthPingResponse = {
  status?: string;
};

const HEALTH_PATH = "/health";

/** Ejemplo de lectura remota; en producción requiere backend o proxy bajo el mismo origin. */
export async function getHealthPing(): Promise<HealthPingResponse> {
  return requestJson<HealthPingResponse>(HEALTH_PATH);
}
