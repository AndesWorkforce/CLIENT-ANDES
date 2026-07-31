import { getPagosClientes } from "./actions/pagos.actions";
import InvoicesPageContent from "./components/InvoicesPageContent";

export default async function AdminHubPagosPage() {
  const result = await getPagosClientes({ limit: 500 });

  return (
    <div className="px-3">
      <InvoicesPageContent
        initialClients={result.data ?? []}
        initialError={
          result.success ? null : (result.message ?? "Error al obtener clientes")
        }
      />
    </div>
  );
}
