import { describe, it, expect } from "vitest";
import {
  isValidBarcode,
  cleanBarcode,
  DEMO_BARCODES,
} from "../lib/barcode-service";

describe("Barcode Service", () => {
  describe("isValidBarcode", () => {
    it("accepts valid EAN-13 codes", () => {
      expect(isValidBarcode("7501000529104")).toBe(true);
      expect(isValidBarcode("750-100-052-9104")).toBe(true);
    });

    it("accepts valid EAN-8 codes", () => {
      expect(isValidBarcode("96385074")).toBe(true);
    });

    it("rejects codes with less than 8 digits", () => {
      expect(isValidBarcode("1234567")).toBe(false);
    });

    it("rejects codes with more than 14 digits", () => {
      expect(isValidBarcode("123456789012345")).toBe(false);
    });

    it("rejects empty strings", () => {
      expect(isValidBarcode("")).toBe(false);
    });
  });

  describe("cleanBarcode", () => {
    it("removes non-digit characters", () => {
      expect(cleanBarcode("750-100-052-9104")).toBe("7501000529104");
      expect(cleanBarcode("750 100 052 9104")).toBe("7501000529104");
      expect(cleanBarcode("750.100.052.9104")).toBe("7501000529104");
    });

    it("returns the same string if already clean", () => {
      expect(cleanBarcode("7501000529104")).toBe("7501000529104");
    });

    it("handles empty strings", () => {
      expect(cleanBarcode("")).toBe("");
    });
  });

  describe("DEMO_BARCODES", () => {
    it("contains valid demo products", () => {
      expect(Object.keys(DEMO_BARCODES).length).toBeGreaterThan(0);
    });

    it("all demo products have required fields", () => {
      Object.values(DEMO_BARCODES).forEach((product) => {
        expect(product.name).toBeTruthy();
        expect(product.category).toBeTruthy();
        expect(product.found).toBe(true);
      });
    });

    it("can retrieve a demo product by barcode", () => {
      const product = DEMO_BARCODES["7501000529104"];
      expect(product).toBeDefined();
      expect(product.name).toBe("Leche Entera Lala");
      expect(product.category).toBe("lacteos");
    });
  });
});
