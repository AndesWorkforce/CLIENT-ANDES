export type InvoiceStatus = "Pendiente" | "Pagado" | "Vencido";

export interface Invoice {
  id: string;
  clientId: string;
  client: string;
  period: string;
  totalAmount: string;
  status: InvoiceStatus;
}

export const MOCK_INVOICES: Invoice[] = [
  { id: "1", clientId: "001584", client: "BK", period: "Marzo 2026", totalAmount: "$6.300", status: "Pendiente" },
  { id: "2", clientId: "001584", client: "Estancia", period: "Mayo 2026", totalAmount: "$15.000", status: "Pendiente" },
  { id: "3", clientId: "001584", client: "Rocket", period: "Mayo 2026", totalAmount: "$15.000", status: "Pendiente" },
  { id: "4", clientId: "001584", client: "Tabak", period: "Mayo 2026", totalAmount: "$15.000", status: "Pendiente" },
  { id: "5", clientId: "001584", client: "Port", period: "Mayo 2026", totalAmount: "$15.000", status: "Pendiente" },
  { id: "6", clientId: "001584", client: "Ve", period: "Mayo 2026", totalAmount: "$15.000", status: "Pendiente" },
  { id: "7", clientId: "001584", client: "WHG", period: "Mayo 2026", totalAmount: "$18.000", status: "Pendiente" },
  { id: "8", clientId: "001584", client: "H&P", period: "Mayo 2026", totalAmount: "$18.000", status: "Pendiente" },
];

export const MONTH_OPTIONS = [
  "Marzo del 2025",
  "Abril del 2025",
  "Mayo del 2025",
  "Junio del 2025",
  "Julio del 2025",
  "Agosto del 2025",
  "Septiembre del 2025",
  "Octubre del 2025",
  "Noviembre del 2025",
  "Diciembre del 2025",
  "Enero del 2026",
  "Febrero del 2026",
  "Marzo del 2026",
];
