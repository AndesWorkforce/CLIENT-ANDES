import { describe, it, expect } from "vitest";
import { formatMoney, formatPaymentLineQuantityWithAmount } from "./payroll-calculations";

describe("formatMoney", () => {
  it("debe formatear montos enteros con punto decimal", () => {
    expect(formatMoney(1234)).toBe("$1,234.00");
    expect(formatMoney(1000)).toBe("$1,000.00");
    expect(formatMoney(100)).toBe("$100.00");
  });

  it("debe formatear montos con decimales usando punto", () => {
    expect(formatMoney(1234.56)).toBe("$1,234.56");
    expect(formatMoney(1000.99)).toBe("$1,000.99");
    expect(formatMoney(100.5)).toBe("$100.50");
  });

  it("debe usar coma para separar miles", () => {
    expect(formatMoney(1234567.89)).toBe("$1,234,567.89");
    expect(formatMoney(1000000)).toBe("$1,000,000.00");
    expect(formatMoney(999999.99)).toBe("$999,999.99");
  });

  it("debe formatear montos pequeños correctamente", () => {
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(1)).toBe("$1.00");
    expect(formatMoney(0.99)).toBe("$0.99");
  });

  it("debe manejar montos negativos", () => {
    expect(formatMoney(-1234.56)).toBe("-$1,234.56");
    expect(formatMoney(-100)).toBe("-$100.00");
  });

  it("debe redondear a 2 decimales", () => {
    expect(formatMoney(1234.567)).toBe("$1,234.57");
    expect(formatMoney(1234.564)).toBe("$1,234.56");
  });
});

describe("formatPaymentLineQuantityWithAmount", () => {
  it("debe formatear cantidad con monto en formato USD", () => {
    expect(formatPaymentLineQuantityWithAmount(18, 3200)).toBe("18 — $3,200.00");
    expect(formatPaymentLineQuantityWithAmount(20, 4500.50)).toBe("20 — $4,500.50");
  });

  it("debe manejar cantidades pequeñas", () => {
    expect(formatPaymentLineQuantityWithAmount(1, 100)).toBe("1 — $100.00");
    expect(formatPaymentLineQuantityWithAmount(0, 0)).toBe("0 — $0.00");
  });
});
