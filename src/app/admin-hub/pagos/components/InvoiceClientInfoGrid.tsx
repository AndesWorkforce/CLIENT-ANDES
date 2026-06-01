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
import InvoiceInfoCard from "./InvoiceInfoCard";

interface InvoiceClientInfoGridProps {
  invoice: InvoiceDetail;
}

export default function InvoiceClientInfoGrid({ invoice }: InvoiceClientInfoGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-[7px] gap-y-[11px] sm:grid-cols-2 xl:grid-cols-4">
      <InvoiceInfoCard icon={Hash} label="ID de la empresa" value={invoice.clientId} />
      <InvoiceInfoCard icon={Globe} label="País" value={invoice.country} />
      <InvoiceInfoCard icon={Calendar} label="Fecha emisión" value={invoice.issueDate} />
      <InvoiceInfoCard icon={CalendarClock} label="Fecha limite" value={invoice.dueDate} />
      <InvoiceInfoCard icon={CircleUser} label="Nombre de contacto" value={invoice.contactName} />
      <InvoiceInfoCard icon={Mail} label="Email de contacto" value={invoice.contactEmail} />
      <InvoiceInfoCard icon={Phone} label="Teléfono de contacto" value={invoice.contactPhone} />
    </div>
  );
}
