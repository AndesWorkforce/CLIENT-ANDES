import { notFound } from "next/navigation";
import { getInvoiceDetail } from "../../data/mock-invoice-details";
import InvoiceDetailContent from "../../components/InvoiceDetailContent";

interface InvoiceDetailPageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { invoiceId } = await params;
  const invoice = getInvoiceDetail(invoiceId);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailContent invoice={invoice} />;
}
