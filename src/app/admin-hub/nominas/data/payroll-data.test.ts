import { describe, it, expect } from "vitest";
import { formatVariableColumn } from "./payroll-data";

describe("formatVariableColumn", () => {
  it("debe formatear cero con signo positivo y decimales", () => {
    expect(formatVariableColumn(0)).toBe("+$0.00");
  });

  it("debe formatear montos positivos con signo + y formato USD", () => {
    expect(formatVariableColumn(1234.56)).toBe("+$1,234.56");
    expect(formatVariableColumn(100)).toBe("+$100.00");
    expect(formatVariableColumn(1000000)).toBe("+$1,000,000.00");
  });

  it("debe formatear montos negativos con signo - y formato USD", () => {
    expect(formatVariableColumn(-1234.56)).toBe("-$1,234.56");
    expect(formatVariableColumn(-100)).toBe("-$100.00");
    expect(formatVariableColumn(-1000000)).toBe("-$1,000,000.00");
  });

  it("debe usar coma para miles y punto para decimales", () => {
    expect(formatVariableColumn(5678.90)).toBe("+$5,678.90");
    expect(formatVariableColumn(-9999.99)).toBe("-$9,999.99");
  });

  it("debe redondear a 2 decimales", () => {
    expect(formatVariableColumn(1234.567)).toBe("+$1,234.57");
    expect(formatVariableColumn(-1234.564)).toBe("-$1,234.56");
  });
});
