"use client";

import {
  Calendar,
  CalendarClock,
  CircleUser,
  Globe,
  Hash,
  Mail,
  Phone,
} from "lucide-react";
import type { InvoiceDetail } from "../data/mock-invoice-details";
import { t } from "../../i18n";
import InvoiceInfoCard from "./InvoiceInfoCard";

interface InvoiceClientInfoGridProps {
  invoice: InvoiceDetail;
}

export default function InvoiceClientInfoGrid({ invoice }: InvoiceClientInfoGridProps) {

  return (
    <div className="grid w-full grid-cols-1 gap-x-[7px] gap-y-[11px] sm:grid-cols-2 xl:grid-cols-4">
      <InvoiceInfoCard icon={Hash} label={t("pagos.companyId")} value={invoice.clientId} />
      <InvoiceInfoCard icon={Globe} label={t("pagos.country")} value={invoice.country} />
      <InvoiceInfoCard icon={Calendar} label={t("pagos.issueDate")} value={invoice.issueDate} />
      <InvoiceInfoCard icon={CalendarClock} label={t("pagos.dueDate")} value={invoice.dueDate} />
      <InvoiceInfoCard icon={CircleUser} label={t("pagos.contactName")} value={invoice.contactName} />
      <InvoiceInfoCard icon={Mail} label={t("pagos.contactEmail")} value={invoice.contactEmail} />
      <InvoiceInfoCard icon={Phone} label={t("pagos.contactPhone")} value={invoice.contactPhone} />
    </div>
  );
}
