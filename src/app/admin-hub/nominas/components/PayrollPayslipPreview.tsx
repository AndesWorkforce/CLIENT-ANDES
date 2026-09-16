"use client";

import { useMemo } from "react";
import PayslipDocument, {
  type PayslipDocumentData,
} from "@/components/payslip/PayslipDocument";
import type { PayrollDetail } from "../types/nomina-detail.types";
import { buildPayslipPreviewData } from "../lib/payslip-format";

interface PayrollPayslipPreviewProps {
  detail: PayrollDetail;
  interactive?: boolean;
}

/**
 * Desprendible del detalle de nómina. Solo adapta los datos: el documento en sí
 * vive en `PayslipDocument`, compartido con la vista del contratista.
 */
export default function PayrollPayslipPreview({
  detail,
  interactive = true,
}: PayrollPayslipPreviewProps) {
  const data = useMemo<PayslipDocumentData>(() => {
    const payslip = buildPayslipPreviewData(detail);

    return {
      ...payslip,
      earningRows: [
        {
          id: "regular-days",
          label: payslip.regularDaysLabel,
          value: payslip.regularDaysValue,
        },
        { id: "holidays", label: "Holidays", value: payslip.holidaysValue },
        {
          id: "bonus",
          label: "Bonus",
          value: payslip.bonusTotal,
          items: payslip.bonusItems,
          expandable: true,
        },
        {
          id: "variables",
          label: "Variables",
          value: payslip.variablesTotal,
          items: payslip.variableItems,
          expandable: true,
        },
      ],
    };
  }, [detail]);

  return <PayslipDocument data={data} interactive={interactive} />;
}
