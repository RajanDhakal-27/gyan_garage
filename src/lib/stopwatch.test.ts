import { describe, it, expect } from "vitest";
import { formatStopwatchTime } from "./stopwatch";

describe("formatStopwatchTime", () => {
  it("formats 0 milliseconds correctly", () => {
    const formatted = formatStopwatchTime(0);
    expect(formatted).toEqual({
      hours: "00",
      minutes: "00",
      seconds: "00",
      centiseconds: "00",
    });
  });

  it("formats milliseconds into seconds and hundredths", () => {
    const formatted = formatStopwatchTime(5420);
    expect(formatted.seconds).toBe("05");
    expect(formatted.centiseconds).toBe("42");
    expect(formatted.minutes).toBe("00");
    expect(formatted.hours).toBe("00");
  });

  it("formats minutes and seconds accurately", () => {
    const ms = (2 * 60 + 15) * 1000 + 890;
    const formatted = formatStopwatchTime(ms);
    expect(formatted.minutes).toBe("02");
    expect(formatted.seconds).toBe("15");
    expect(formatted.centiseconds).toBe("89");
    expect(formatted.hours).toBe("00");
  });

  it("formats hours, minutes, and seconds properly for extended sessions", () => {
    const ms = (1 * 3600 + 45 * 60 + 30) * 1000 + 120;
    const formatted = formatStopwatchTime(ms);
    expect(formatted.hours).toBe("01");
    expect(formatted.minutes).toBe("45");
    expect(formatted.seconds).toBe("30");
    expect(formatted.centiseconds).toBe("12");
  });
});
