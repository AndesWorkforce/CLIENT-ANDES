import { Check } from "lucide-react";
import type { PaymentChecklistState } from "../actions/payment-checklist.actions";

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  helper?: string;
};

type GuidePaymentChecklistProps = {
  state: PaymentChecklistState;
};

function getInvoiceHelper(state: PaymentChecklistState): string {
  if (state.invoiceGenerated) {
    if (state.lastInvoice) {
      const numberPart = state.lastInvoice.invoiceNumber
        ? ` (${state.lastInvoice.invoiceNumber})`
        : "";
      return `Last invoice generated: ${state.lastInvoice.monthLabel} ${state.lastInvoice.year}${numberPart}`;
    }
    return `Generated for ${state.currentYearMonth}`;
  }

  if (state.lastInvoice) {
    const numberPart = state.lastInvoice.invoiceNumber
      ? ` (${state.lastInvoice.invoiceNumber})`
      : "";
    return `Last invoice generated: ${state.lastInvoice.monthLabel} ${state.lastInvoice.year}${numberPart}. Generate the invoice for ${state.currentYearMonth} in Current Contract.`;
  }

  return `Generate your invoice for ${state.currentYearMonth} in Current Contract.`;
}

export default function GuidePaymentChecklist({
  state,
}: GuidePaymentChecklistProps) {
  const items: ChecklistItem[] = [
    {
      id: "bank",
      label: "Bank information updated",
      done: state.bankInformationUpdated,
    },
    {
      id: "invoice",
      label: "Invoice generated",
      done: state.invoiceGenerated,
      helper: getInvoiceHelper(state),
    },
    {
      id: "planilla",
      label: "Planilla uploaded (Colombia residents only)",
      done: state.planillaApplicable ? state.planillaUploaded : true,
    },
  ];

  return (
    <aside className="w-full rounded-[10px] border border-[#c8c8c8] bg-[#f8f8f8] px-5 py-7 sm:px-[25px] sm:py-[34px]">
      <h3 className="text-[20px] font-semibold leading-[1.3] text-[#101828]">
        Payment Checklist
      </h3>

      <ul className="mt-4 flex flex-col">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`flex items-start gap-3 ${index === 0 ? "" : "pt-3"}`}
          >
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] ${
                item.done
                  ? "bg-[#0097b2] text-white"
                  : "border border-[#c8c8c8] bg-white"
              }`}
              aria-label={item.done ? "Completed" : "Pending"}
            >
              {item.done && (
                <Check className="size-3" strokeWidth={3} aria-hidden />
              )}
            </span>
            <div className="min-w-0">
              <span
                className={`text-[16px] font-medium leading-[1.2] ${
                  item.done ? "text-[#1e2939]" : "text-[#858585]"
                }`}
              >
                {item.label}
              </span>
              {item.helper && (
                <p className="mt-1 text-[13px] leading-[1.4] text-[#858585]">
                  {item.helper}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!state.authenticated && (
        <p className="mt-4 text-[14px] leading-[1.4] text-[#858585]">
          Sign in to see your live payment checklist status.
        </p>
      )}
    </aside>
  );
}
