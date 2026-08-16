import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const recordNewData = require("../src/services/phyphox");

describe("Phyphox Service", () => {

  beforeEach(() => {
    vi.useFakeTimers();

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/get?")) {
        return Promise.resolve({
          json: async () => ({
            buffer: {
              dB: { buffer: [50, 60, 70] },
              time: { buffer: [0, 1, 2] }
            }
          })
        });
      }

      return Promise.resolve({
        json: async () => ({})
      });
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should clear previous data", async () => {
    const promise = recordNewData("192.168.1.10", 1000);

    await vi.runAllTimersAsync();
    await promise;

    expect(fetch).toHaveBeenCalledWith(
      "http://192.168.1.10:8080/control?cmd=clear"
    );
  });

  it("should start recording", async () => {
    const promise = recordNewData("192.168.1.10", 1000);

    await vi.runAllTimersAsync();
    await promise;

    expect(fetch).toHaveBeenCalledWith(
      "http://192.168.1.10:8080/control?cmd=start"
    );
  });

  it("should stop recording", async () => {
    const promise = recordNewData("192.168.1.10", 1000);

    await vi.runAllTimersAsync();
    await promise;

    expect(fetch).toHaveBeenCalledWith(
      "http://192.168.1.10:8080/control?cmd=stop"
    );
  });

  it("should request the collected data", async () => {
    const promise = recordNewData("192.168.1.10", 1000);

    await vi.runAllTimersAsync();
    await promise;

    expect(fetch).toHaveBeenCalledWith(
      "http://192.168.1.10:8080/get?calibration=&dB=full&time=full"
    );
  });

  it("should return the collected buffer", async () => {
    const promise = recordNewData("192.168.1.10", 1000);

    await vi.runAllTimersAsync();

    const result = await promise;

    expect(result).toEqual({
      dB: { buffer: [50, 60, 70] },
      time: { buffer: [0, 1, 2] }
    });
  });

  it("should propagate a fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(
      new Error("Phyphox unavailable")
    );

    await expect(
      recordNewData("192.168.1.10", 0)
    ).rejects.toThrow("Phyphox unavailable");
  });

});