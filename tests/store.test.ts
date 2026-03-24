import { describe, it, expect } from "vitest";
import {
  getDaysUntilExpiry,
  getExpiryStatus,
  generateId,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  LOCATION_LABELS,
} from "../lib/store";

describe("getDaysUntilExpiry", () => {
  it("returns 0 for today", () => {
    const today = new Date().toISOString();
    expect(getDaysUntilExpiry(today)).toBe(0);
  });

  it("returns positive days for future dates", () => {
    const future = new Date(Date.now() + 7 * 86400000).toISOString();
    expect(getDaysUntilExpiry(future)).toBe(7);
  });

  it("returns negative days for past dates", () => {
    const past = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(getDaysUntilExpiry(past)).toBe(-3);
  });
});

describe("getExpiryStatus", () => {
  it("returns 'expired' for negative days", () => {
    expect(getExpiryStatus(-1)).toBe("expired");
    expect(getExpiryStatus(-10)).toBe("expired");
  });

  it("returns 'warning' for 0-3 days", () => {
    expect(getExpiryStatus(0)).toBe("warning");
    expect(getExpiryStatus(1)).toBe("warning");
    expect(getExpiryStatus(3)).toBe("warning");
  });

  it("returns 'fresh' for 4+ days", () => {
    expect(getExpiryStatus(4)).toBe("fresh");
    expect(getExpiryStatus(30)).toBe("fresh");
  });
});

describe("generateId", () => {
  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("generates non-empty strings", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
});

describe("CATEGORY_LABELS", () => {
  it("has labels for all categories", () => {
    const categories = ["lacteos", "frutas", "verduras", "carnes", "granos", "bebidas", "otros"];
    categories.forEach((cat) => {
      expect(CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]).toBeTruthy();
    });
  });
});

describe("CATEGORY_ICONS", () => {
  it("has emoji icons for all categories", () => {
    const categories = ["lacteos", "frutas", "verduras", "carnes", "granos", "bebidas", "otros"];
    categories.forEach((cat) => {
      const icon = CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS];
      expect(icon).toBeTruthy();
      expect(typeof icon).toBe("string");
    });
  });
});

describe("LOCATION_LABELS", () => {
  it("has labels for all locations", () => {
    const locations = ["nevera", "congelador", "despensa"];
    locations.forEach((loc) => {
      expect(LOCATION_LABELS[loc as keyof typeof LOCATION_LABELS]).toBeTruthy();
    });
  });
});
