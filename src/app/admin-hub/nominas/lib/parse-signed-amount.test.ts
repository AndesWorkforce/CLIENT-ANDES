import { describe, it, expect } from "vitest";
import { parseSignedAmountInput, sanitizeSignedAmountInput } from "./parse-signed-amount";

describe("parseSignedAmountInput", () => {
  it("debe parsear montos positivos enteros", () => {
    expect(parseSignedAmountInput("200")).toBe(200);
    expect(parseSignedAmountInput("1234")).toBe(1234);
    expect(parseSignedAmountInput("0")).toBe(0);
  });

  it("debe parsear montos negativos enteros", () => {
    expect(parseSignedAmountInput("-200")).toBe(-200);
    expect(parseSignedAmountInput("-1234")).toBe(-1234);
  });

  it("debe parsear montos con decimales usando punto", () => {
    expect(parseSignedAmountInput("200.50")).toBe(200.5);
    expect(parseSignedAmountInput("1234.56")).toBe(1234.56);
    expect(parseSignedAmountInput("-200.50")).toBe(-200.5);
  });

  it("debe ignorar caracteres no numéricos excepto punto y signo", () => {
    expect(parseSignedAmountInput("$200.50")).toBe(200.5);
    expect(parseSignedAmountInput("1,234.56")).toBe(1234.56);
    expect(parseSignedAmountInput("-$1,234.56")).toBe(-1234.56);
  });

  it("debe retornar 0 para valores vacíos o inválidos", () => {
    expect(parseSignedAmountInput("")).toBe(0);
    expect(parseSignedAmountInput("   ")).toBe(0);
    expect(parseSignedAmountInput("-")).toBe(0);
  });
});

describe("sanitizeSignedAmountInput", () => {
  it("debe permitir dígitos", () => {
    expect(sanitizeSignedAmountInput("200")).toBe("200");
    expect(sanitizeSignedAmountInput("1234")).toBe("1234");
  });

  it("debe permitir signo negativo al inicio", () => {
    expect(sanitizeSignedAmountInput("-200")).toBe("-200");
    expect(sanitizeSignedAmountInput("-1234")).toBe("-1234");
  });

  it("debe permitir punto decimal", () => {
    expect(sanitizeSignedAmountInput("200.50")).toBe("200.50");
    expect(sanitizeSignedAmountInput("1234.56")).toBe("1234.56");
    expect(sanitizeSignedAmountInput("-200.50")).toBe("-200.50");
  });

  it("debe eliminar caracteres no válidos", () => {
    expect(sanitizeSignedAmountInput("$200")).toBe("200");
    expect(sanitizeSignedAmountInput("abc123")).toBe("123");
    expect(sanitizeSignedAmountInput("-$200.50")).toBe("-200.50");
  });

  it("debe permitir solo un punto decimal", () => {
    expect(sanitizeSignedAmountInput("200.50.75")).toBe("200.5075");
    expect(sanitizeSignedAmountInput("1.2.3.4")).toBe("1.234");
  });

  it("debe manejar entrada parcial", () => {
    expect(sanitizeSignedAmountInput("-")).toBe("-");
    expect(sanitizeSignedAmountInput("200.")).toBe("200.");
    expect(sanitizeSignedAmountInput("-.")).toBe("-");
  });

  it("debe retornar vacío para entrada vacía", () => {
    expect(sanitizeSignedAmountInput("")).toBe("");
    expect(sanitizeSignedAmountInput("   ")).toBe("");
  });
});
