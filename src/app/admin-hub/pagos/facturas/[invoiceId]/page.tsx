import { notFound } from "next/navigation";
import { getInvoiceDetail } from "../../actions/pagos.actions";
import InvoiceDetailContent from "../../components/InvoiceDetailContent";

interface InvoiceDetailPageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { invoiceId } = await params;
  const result = await getInvoiceDetail(invoiceId);

  if (!result.success || !result.data) {
    notFound();
  }

  return <InvoiceDetailContent invoice={result.data} />;
}
