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
  { id: "9", clientId: "001584", client: "BK", period: "Junio 2026", totalAmount: "$6.500", status: "Pendiente" },
  { id: "10", clientId: "001584", client: "Estancia", period: "Junio 2026", totalAmount: "$15.200", status: "Pendiente" },
  { id: "11", clientId: "001584", client: "Rocket", period: "Junio 2026", totalAmount: "$15.400", status: "Pagado" },
  { id: "12", clientId: "001584", client: "Tabak", period: "Junio 2026", totalAmount: "$14.800", status: "Pendiente" },
  { id: "13", clientId: "001584", client: "Port", period: "Junio 2026", totalAmount: "$16.100", status: "Pendiente" },
  { id: "14", clientId: "001584", client: "Ve", period: "Junio 2026", totalAmount: "$15.600", status: "Vencido" },
  { id: "15", clientId: "001584", client: "WHG", period: "Junio 2026", totalAmount: "$18.200", status: "Pendiente" },
  { id: "16", clientId: "001584", client: "H&P", period: "Junio 2026", totalAmount: "$17.900", status: "Pagado" },
];
