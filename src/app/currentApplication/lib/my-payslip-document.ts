import type {
  PayslipDocumentData,
  PayslipLineItem,
} from "@/components/payslip/PayslipDocument";
import type { MyPayslipDetail, MyPayslipLine } from "../actions/payslips.actions";

function toLineItems(lines: MyPayslipLine[], prefix: string): PayslipLineItem[] {
  return lines.map((line, index) => ({
    id: `${prefix}-${index}`,
    label: line.label,
    value: line.value,
  }));
}

function formatGeneratedOn(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Adapta el desprendible propio del contratista al documento compartido.
 *
 * `payslips/me/:periodo` no expone todavía fecha de contratación, holiday rate
 * ni saldo de PTO, así que esos campos quedan sin valor y el documento los
 * muestra como "—". El email no viaja en el payload: lo aporta el auth store.
 */
export function buildMyPayslipDocumentData(
  detail: MyPayslipDetail,
  email?: string,
): PayslipDocumentData {
  return {
    contractorName: detail.contractorName,
    position: detail.position,
    email,
    startDate: detail.startDate,
    monthlyBase: detail.monthlyPayment,
    netPay: detail.totalNetPay,
    grossPay: detail.totalEarnings,
    totalEarnings: detail.totalEarnings,
    totalDeductions: detail.totalDeductions,
    totalDeductionsSigned: `− ${detail.totalDeductions}`,
    generatedOn: formatGeneratedOn(detail.emitidoEn),
    earningRows: toLineItems(detail.earnings, "earning"),
    deductions: toLineItems(detail.deductions, "deduction"),
  };
}
