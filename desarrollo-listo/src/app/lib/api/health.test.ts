import { afterEach, describe, expect, it, vi } from "vitest";
import { getHealthPing } from "./health";

describe("getHealthPing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("devuelve JSON en 200", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "up" }),
    } as Response);

    const data = await getHealthPing();
    expect(data).toEqual({ status: "up" });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.test.local/health",
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
      }),
    );
  });

  it("lanza ApiError en respuesta no OK", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    } as Response);

    await expect(getHealthPing()).rejects.toMatchObject({
      code: "HTTP",
      status: 503,
    });
  });
});
