import { describe, it, expect } from "vitest";
import { 
  formatContractSalary, 
  parseContractSalaryInput, 
  formatVariableImpact 
} from "./contract-detail-display";

describe("formatContractSalary", () => {
  it("debe formatear salarios USD con prefijo US $ y formato USD", () => {
    expect(formatContractSalary(1234.56, "USD")).toBe("US $1,234.56");
    expect(formatContractSalary(5000, "USD")).toBe("US $5,000.00");
    expect(formatContractSalary(999999.99, "USD")).toBe("US $999,999.99");
  });

  it("debe formatear salarios con otras monedas", () => {
    expect(formatContractSalary(1234.56, "EUR")).toBe("EUR 1,234.56");
    expect(formatContractSalary(5000, "COP")).toBe("COP 5,000.00");
  });

  it("debe usar coma para miles y punto para decimales", () => {
    expect(formatContractSalary(1234567.89, "USD")).toBe("US $1,234,567.89");
  });
});

describe("parseContractSalaryInput", () => {
  it("debe parsear formato USD (comas para miles, punto para decimales)", () => {
    expect(parseContractSalaryInput("1,234.56")).toBe(1234.56);
    expect(parseContractSalaryInput("$1,234.56")).toBe(1234.56);
    expect(parseContractSalaryInput("US $1,234.56")).toBe(1234.56);
  });

  it("debe parsear formato europeo (puntos para miles, coma para decimales)", () => {
    expect(parseContractSalaryInput("1.234,56")).toBe(1234.56);
    expect(parseContractSalaryInput("$1.234,56")).toBe(1234.56);
  });

  it("debe manejar montos sin decimales", () => {
    expect(parseContractSalaryInput("1234")).toBe(1234);
    expect(parseContractSalaryInput("$1,000")).toBe(1000);
  });

  it("debe retornar null para valores inválidos", () => {
    expect(parseContractSalaryInput("")).toBeNull();
    expect(parseContractSalaryInput("abc")).toBeNull();
  });
});

describe("formatVariableImpact", () => {
  it("debe formatear montos positivos con + y formato USD", () => {
    expect(formatVariableImpact(1234.56)).toBe("+$1,234.56");
    expect(formatVariableImpact(100)).toBe("+$100.00");
    expect(formatVariableImpact(0)).toBe("+$0.00");
  });

  it("debe formatear montos negativos con - y formato USD", () => {
    expect(formatVariableImpact(-1234.56)).toBe("-$1,234.56");
    expect(formatVariableImpact(-100)).toBe("-$100.00");
  });

  it("debe usar coma para miles y punto para decimales", () => {
    expect(formatVariableImpact(999999.99)).toBe("+$999,999.99");
    expect(formatVariableImpact(-999999.99)).toBe("-$999,999.99");
  });
});
