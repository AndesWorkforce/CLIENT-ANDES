import { MOCK_INVOICES, type Invoice, type InvoiceStatus } from "./mock-invoices";

export interface InvoiceLineItem {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: string;
  amountIsNegative?: boolean;
  status: InvoiceStatus;
  createdBy: string;
}

export interface InvoiceSection {
  id: string;
  title: string;
  tabKey: "customer-charges" | "customer-credits";
  items: InvoiceLineItem[];
  subtotal: string;
  subtotalIsNegative?: boolean;
}

export interface InvoiceDetail extends Invoice {
  country: string;
  issueDate: string;
  dueDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  grandTotal: string;
  sections: InvoiceSection[];
}

const defaultSections: InvoiceSection[] = [
  {
    id: "charges",
    title: "Customer Charges",
    tabKey: "customer-charges",
    subtotal: "$6.500",
    items: [
      { id: "c1", date: "03.03.2026", type: "Nomina", description: "Juan Perez", amount: "$1.100", status: "Pendiente", createdBy: "Violeta Q" },
      { id: "c2", date: "03.03.2026", type: "Nomina", description: "Carla Sanchez", amount: "$1.100", status: "Pendiente", createdBy: "Violeta Q" },
      { id: "c3", date: "03.03.2026", type: "Nomina", description: "Martin Diaz", amount: "$1.100", status: "Pendiente", createdBy: "Violeta Q" },
      { id: "c4", date: "03.03.2026", type: "Nómina", description: "Clara Rodriguez", amount: "$1.100", status: "Pendiente", createdBy: "Violeta Q" },
      { id: "c5", date: "03.03.2026", type: "Bono", description: "Bono trimestral", amount: "$1.000", status: "Pendiente", createdBy: "Violeta Q" },
      { id: "c6", date: "03.03.2026", type: "Tarifa", description: "Tarifa administrativa", amount: "$1.100", status: "Pendiente", createdBy: "Violeta Q" },
    ],
  },
  {
    id: "credits",
    title: "Customer Credits",
    tabKey: "customer-credits",
    subtotal: "-$200",
    subtotalIsNegative: true,
    items: [
      { id: "r1", date: "03.03.2026", type: "Deducción", description: "Ajuste nómina", amount: "-$100", amountIsNegative: true, status: "Pendiente", createdBy: "Violeta Q" },
      { id: "r2", date: "03.03.2026", type: "Nomina", description: "Corrección", amount: "-$100", amountIsNegative: true, status: "Pendiente", createdBy: "Violeta Q" },
    ],
  },
];

function buildDetail(invoice: Invoice): InvoiceDetail {
  const emailSlug = invoice.client.toLowerCase().replace(/[^a-z0-9]/g, "") || "cliente";
  return {
    ...invoice,
    country: "EEUU",
    issueDate: "03.03.2026",
    dueDate: "03.30.2026",
    contactName: "Laura",
    contactEmail: `${emailSlug}@bk.com`,
    contactPhone: "+12 9 125 156 1484",
    grandTotal: invoice.id === "1" ? "$6.300" : invoice.totalAmount,
    sections: defaultSections,
  };
}

const DETAILS: Record<string, InvoiceDetail> = {};

MOCK_INVOICES.forEach((inv) => {
  DETAILS[inv.id] = buildDetail(inv);
});

export function getInvoiceDetail(id: string): InvoiceDetail | undefined {
  return DETAILS[id];
}
