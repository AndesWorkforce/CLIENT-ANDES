import { describe, expect, it } from "vitest";
import {
  INVOICE_ITEM_CURRENCY,
  isCreateItemFormComplete,
} from "./invoice-item-currency";

describe("invoice-item-currency — moneda USD", () => {
  it("fija la moneda de cargos y créditos en USD", () => {
    expect(INVOICE_ITEM_CURRENCY).toBe("USD");
  });

  it("el formulario está completo sin seleccionar moneda", () => {
    expect(
      isCreateItemFormComplete({
        tipo: "equipamiento",
        descripcion: "Laptop",
        monto: "350",
      })
    ).toBe(true);
  });

  it("sigue exigiendo tipo, descripción y monto", () => {
    expect(
      isCreateItemFormComplete({ tipo: "", descripcion: "Laptop", monto: "350" })
    ).toBe(false);
    expect(
      isCreateItemFormComplete({ tipo: "equipamiento", descripcion: "  ", monto: "350" })
    ).toBe(false);
    expect(
      isCreateItemFormComplete({ tipo: "equipamiento", descripcion: "Laptop", monto: "" })
    ).toBe(false);
  });
});
