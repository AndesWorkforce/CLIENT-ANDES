"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getContracts,
  finalizarContrato,
  uploadFinalContract,
  cancelarContrato,
  marcarEnviadoAlProveedor,
  reenviarContratoAlProveedor,
} from "./actions/contracts.actions";
import {
  ProcesoContratacion,
  EstadoContratacion,
} from "./interfaces/contracts.interface";
import {
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  XSquare,
  PenTool,
  AlertTriangle,
  FileText,
} from "lucide-react";
import TableSkeleton from "../components/TableSkeleton";
import CancelContractModal from "./components/CancelContractModal";
import SendAnnexModal from "./components/SendAnnexModal";
import AnnexesListModal from "./components/AnnexesListModal";
import * as XLSX from "xlsx";

import { useNotificationStore } from "@/store/notifications.store";
import { sendProviderContractEmail } from "../actions/sendEmail.actions";

// Using imported interfaces from ./interfaces/contracts.interface.ts

// Componente auxiliar para manejar la carga asíncrona del estado de documentos leídos
interface DocumentReadStatusProps {
  contract: ProcesoContratacion;
}

const DocumentReadStatus = ({ contract }: DocumentReadStatusProps) => {
  // Calculate based on the 4 required docs newly added
  const requiredDocs = [
    contract.introduccionLeido,
    contract.politicasLeido,
    contract.beneficiosLeido,
    contract.reglamentoLeido,
  ];

  const readCount = requiredDocs.filter(Boolean).length;
  const totalRequired = 4;
  const percentage = Math.round((readCount / totalRequired) * 100);
  const completed = percentage === 100;

  return (
    <span
      className={`px-2 py-1 ${
        completed
          ? "bg-[#E6F4F6] text-[#0097B2]"
          : "bg-yellow-100 text-yellow-800"
      } text-xs rounded-full`}
    >
      {completed ? "Yes" : `${percentage}%`}
    </span>
  );
};

const TerminateContractModal = ({
  contract,
  onClose,
  onConfirm,
}: {
  contract: ProcesoContratacion;
  onClose: () => void;
  onConfirm: (data: {
    motivo?: string;
    observaciones?: string;
  }) => Promise<void>;
}) => {
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      alert("Please provide a reason for contract termination");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        motivo: motivo.trim(),
        observaciones: observaciones.trim() || undefined,
      });
      // No llamar onClose() aquí - se maneja desde la función principal
    } catch (error) {
      console.error("Error submitting termination:", error);
      // El modal permanece abierto en caso de error para que el usuario pueda reintentar
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Terminate Contract - {contract.nombreCompleto}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for termination *
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            placeholder="Enter the reason for contract termination"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional observations
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            rows={3}
            placeholder="Add any additional observations (optional)"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !motivo.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <XSquare size={16} className="mr-2" />
                Terminate Contract
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContractsPage() {
  const { addNotification } = useNotificationStore();
  const [contracts, setContracts] = useState<ProcesoContratacion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  // Rows per page control
  const [rowsPerPage, setRowsPerPage] = useState<number>(15);
  const [selectedContract, setSelectedContract] =
    useState<ProcesoContratacion | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancellingContract, setIsCancellingContract] = useState(false);
  const [isAnnexModalOpen, setIsAnnexModalOpen] = useState(false);
  const [selectedContractForAnnex, setSelectedContractForAnnex] =
    useState<ProcesoContratacion | null>(null);
  const [isAnnexListModalOpen, setIsAnnexListModalOpen] = useState(false);
  const [selectedContractForAnnexList, setSelectedContractForAnnexList] =
    useState<ProcesoContratacion | null>(null);
  const [isSigningContract, setIsSigningContract] = useState<string | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const response = await getContracts(
        currentPage,
        rowsPerPage,
        searchQuery
      );
      if (response.success && response.data) {
        setContracts(response.data.resultados);
        setTotalPages(response.totalPages || 1);
      } else {
        setContracts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setContracts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [currentPage, searchQuery, rowsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClientFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedClient(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Obtener lista única de clientes para el filtro
  const uniqueClients = Array.from(
    new Set(
      contracts
        .map((contract) => contract.clienteNombre)
        .filter((cliente): cliente is string => !!cliente)
    )
  ).sort();

  // Filtrar contratos por cliente seleccionado
  const filteredContracts = selectedClient
    ? contracts.filter((contract) => contract.clienteNombre === selectedClient)
    : contracts;

  // Sorting state
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getStatusText = (status: EstadoContratacion | string) => {
    switch (status) {
      case EstadoContratacion.PENDIENTE_DOCUMENTOS:
        return "Pending Docs";
      case EstadoContratacion.DOCUMENTOS_EN_LECTURA:
        return "Reading Docs";
      case EstadoContratacion.DOCUMENTOS_COMPLETADOS:
        return "Docs Complete";
      case EstadoContratacion.LECTURA_DOCS_COMPLETA:
        return "Reading Complete";
      case EstadoContratacion.PENDIENTE_FIRMA:
        return "Pending Signature";
      case EstadoContratacion.PENDIENTE_FIRMA_CANDIDATO:
        return "Pending Candidate";
      case EstadoContratacion.PENDIENTE_FIRMA_PROVEEDOR:
        return "Pending Provider";
      case EstadoContratacion.FIRMADO:
        return "Signed";
      case EstadoContratacion.FIRMADO_CANDIDATO:
        return "Candidate Signed";
      case EstadoContratacion.FIRMADO_COMPLETO:
        return "Complete Signed";
      case EstadoContratacion.CONTRATO_FINALIZADO:
        return "Contract Finalized";
      case EstadoContratacion.CANCELADO:
        return "Cancelled";
      case EstadoContratacion.EXPIRADO:
        return "Expired";
      default:
        return String(status || "Unknown");
    }
  };

  const sortedContracts = useMemo(() => {
    if (!sortKey) return filteredContracts;

    const arr = [...filteredContracts];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arr.sort((a: any, b: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = (a as any)[sortKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = (b as any)[sortKey];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalize = (v: any) => {
        if (v == null) return "";
        if (typeof v === "string") return v.toLowerCase();
        if (v instanceof Date) return v.getTime();
        return v;
      };

      let va = normalize(aVal);
      let vb = normalize(bVal);

      if (sortKey === "estadoContratacion") {
        va = getStatusText(aVal).toLowerCase();
        vb = getStatusText(bVal).toLowerCase();
      }

      if (va < vb) return sortDirection === "asc" ? -1 : 1;
      if (va > vb) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filteredContracts, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Export ALL contracts from all pages to Excel
  const exportToExcel = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      addNotification(
        "🔄 Preparing export... Loading all contracts from all pages",
        "info"
      );

      // Primero obtener el total de contratos para calcular páginas
      const firstPage = await getContracts(1, 50, searchQuery);
      if (!firstPage.success) {
        throw new Error("Failed to fetch contracts");
      }

      const totalContracts = firstPage.data.total;
      const totalPages = Math.ceil(totalContracts / 50); // Usar 50 por página para optimizar

      let allContracts: ProcesoContratacion[] = [];

      // Cargar todas las páginas
      for (let page = 1; page <= totalPages; page++) {
        setExportProgress(Math.round((page / totalPages) * 80)); // 80% para carga

        const pageData = await getContracts(page, 50, searchQuery);
        if (pageData.success && pageData.data) {
          allContracts = [...allContracts, ...pageData.data.resultados];
        }

        // Pequeña pausa para no sobrecargar el servidor
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Aplicar filtros de cliente si existe
      const filteredAllContracts = selectedClient
        ? allContracts.filter(
            (contract) => contract.clienteNombre === selectedClient
          )
        : allContracts;

      setExportProgress(90);
      addNotification(
        `📊 Processing ${filteredAllContracts.length} contracts for export...`,
        "info"
      );

      // Convertir a formato Excel
      const rows = filteredAllContracts.map((c) => ({
        "Candidate Name": c.nombreCompleto,
        Client: c.clienteNombre || "",
        Position: c.puestoTrabajo || "",
        "Contract Status": getStatusText(c.estadoContratacion),
        "Documents Read": c.readCompleted
          ? "Yes"
          : `${c.documentReadPercentage || 0}%`,
        "Signed Contract": c.signWellDownloadUrl ? "Yes" : "No",
        "Sent to Provider": c.enviadoAlProveedor ? "Yes" : "No",
        "Sent Date": c.fechaEnvioAlProveedor
          ? new Date(c.fechaEnvioAlProveedor).toLocaleString()
          : "",
        "Start Date": c.fechaInicio
          ? new Date(c.fechaInicio).toLocaleDateString()
          : "",
        "Salary Offer": c.ofertaSalarial || "",
        Currency: c.monedaSalario || "",
        "Start Work Date": c.fechaInicioLabores
          ? new Date(c.fechaInicioLabores).toLocaleDateString()
          : "",
        "Signature Date": c.fechaFirma
          ? new Date(c.fechaFirma).toLocaleDateString()
          : "",
      }));

      setExportProgress(95);

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Contracts");

      const fileName = `contracts-complete-export-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.xlsx`;

      setExportProgress(100);
      XLSX.writeFile(workbook, fileName);

      addNotification(
        `✅ Export completed successfully! Downloaded ${filteredAllContracts.length} contracts from ${totalPages} pages`,
        "success"
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      addNotification(
        `❌ Error exporting contracts to Excel: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page: number) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const renderContractStatus = (status: EstadoContratacion) => {
    let colorClass = "";
    let text = "";

    switch (status) {
      case EstadoContratacion.PENDIENTE_DOCUMENTOS:
        colorClass = "text-gray-600";
        text = "Pending Docs";
        break;
      case EstadoContratacion.DOCUMENTOS_EN_LECTURA:
        colorClass = "text-blue-600";
        text = "Reading Docs";
        break;
      case EstadoContratacion.DOCUMENTOS_COMPLETADOS:
        colorClass = "text-green-600";
        text = "Docs Complete";
        break;
      case EstadoContratacion.LECTURA_DOCS_COMPLETA:
        colorClass = "text-green-600";
        text = "Reading Complete";
        break;
      case EstadoContratacion.PENDIENTE_FIRMA:
        colorClass = "text-yellow-600";
        text = "Pending Signature";
        break;
      case EstadoContratacion.PENDIENTE_FIRMA_CANDIDATO:
        colorClass = "text-yellow-600";
        text = "Pending Candidate";
        break;
      case EstadoContratacion.PENDIENTE_FIRMA_PROVEEDOR:
        colorClass = "text-yellow-600";
        text = "Pending Provider";
        break;
      case EstadoContratacion.FIRMADO:
        colorClass = " text-[#0097B2]";
        text = "Signed";
        break;
      case EstadoContratacion.FIRMADO_CANDIDATO:
        colorClass = " text-[#0097B2]";
        text = "Candidate Signed";
        break;
      case EstadoContratacion.FIRMADO_COMPLETO:
        colorClass = " text-[#0097B2]";
        text = "Complete Signed";
        break;
      case EstadoContratacion.CONTRATO_FINALIZADO:
        colorClass = "text-green-800";
        text = "Contract Finalized";
        break;
      case EstadoContratacion.CANCELADO:
        colorClass = "text-red-600";
        text = "Cancelled";
        break;
      case EstadoContratacion.EXPIRADO:
        colorClass = "text-red-600";
        text = "Expired";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-800";
        text = status || "Unknown";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs uppercase ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  const handleSignContract = async (contractId: string) => {
    const contract = filteredContracts.find((c) => c.id === contractId);
    if (!contract) return;

    // Verificar si ya se envió al provider usando el campo de la base de datos
    if (contract.enviadoAlProveedor) {
      addNotification(
        `Contract for ${
          contract.nombreCompleto
        } has already been sent to the provider${
          contract.fechaEnvioAlProveedor
            ? ` on ${new Date(
                contract.fechaEnvioAlProveedor
              ).toLocaleDateString()}`
            : ""
        }.`,
        "info"
      );
      return;
    }

    setIsSigningContract(contractId);
    try {
      // Send email to provider
      const emailResult = await sendProviderContractEmail({
        id: contract.id,
        nombreCompleto: contract.nombreCompleto,
        // signWellUrlProveedor: contract.signWellUrlProveedor || null, // deprecated
        fechaFirmaProveedor: contract.fechaFirmaProveedor
          ? new Date(contract.fechaFirmaProveedor)
          : null,
        estadoContratacion: contract.estadoContratacion,
        // If available in the contract, pass the provider/manager email
        providerEmail:
          (contract as any).emailProveedor || (contract as any).providerEmail,
      });

      if (emailResult.success) {
        // Marcar como enviado en la base de datos
        try {
          await marcarEnviadoAlProveedor(contractId);

          addNotification(
            `✅ Contract successfully sent to ${contract.nombreCompleto}'s provider! The provider will receive an email with the signing link.`,
            "success"
          );

          // Reload contracts to update status
          await loadContracts();
        } catch (markError) {
          console.error("Error marking contract as sent:", markError);
          addNotification(
            `✅ Email sent successfully but failed to update database. Contract for ${contract.nombreCompleto} was sent to provider.`,
            "warning"
          );
        }
      } else {
        addNotification(
          `❌ Failed to send contract to provider: ${emailResult.message}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error in handleSignContract:", error);
      addNotification(
        `❌ There was an error sending the contract to ${contract.nombreCompleto}'s provider. Please try again.`,
        "error"
      );
    } finally {
      setIsSigningContract(null);
    }
  };

  const handleResendContract = async (contractId: string) => {
    const contract = filteredContracts.find((c) => c.id === contractId);
    if (!contract) return;

    const motivo = prompt(
      `¿Cuál es el motivo del reenvío para ${contract.nombreCompleto}?`,
      "El proveedor reportó no haber recibido el email original"
    );

    if (!motivo) return; // Usuario canceló

    setIsSigningContract(contractId);
    try {
      // Reenviar contrato al proveedor
      const resendResult = await reenviarContratoAlProveedor(
        contractId,
        motivo
      );

      if (resendResult.success) {
        addNotification(
          `🔄 Contract successfully resent to ${contract.nombreCompleto}'s provider! ${resendResult.message}`,
          "success"
        );

        // Reload contracts to update status
        await loadContracts();
      } else {
        addNotification(
          `❌ Failed to resend contract: ${resendResult.message}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error in handleResendContract:", error);
      addNotification(
        `❌ There was an error resending the contract to ${contract.nombreCompleto}'s provider. Please try again.`,
        "error"
      );
    } finally {
      setIsSigningContract(null);
    }
  };

  const handleUploadContract = async (contractId: string) => {
    setSelectedContract(
      filteredContracts.find((c) => c.id === contractId) || null
    );
    setIsUploadModalOpen(true);
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  const handleFinalizarContrato = async (procesoId: string) => {
    const contract = filteredContracts.find((c) => c.id === procesoId);
    if (!contract) return;

    setSelectedContract(contract);
    setIsTerminateModalOpen(true);
  };

  const handleConfirmTermination = async (data: {
    motivo?: string;
    observaciones?: string;
  }) => {
    if (!selectedContract) return;

    try {
      await finalizarContrato(selectedContract.id, data);

      addNotification(
        `Contract for ${selectedContract.nombreCompleto} terminated successfully. Both contract and application are now inactive - the candidate can apply to new positions.`,
        "success"
      );

      // Recargar contratos para ver los cambios
      try {
        await loadContracts();
      } catch (loadError) {
        console.error("Error reloading contracts:", loadError);
        addNotification(
          "Contract terminated successfully but failed to reload the list. Please refresh the page.",
          "warning"
        );
      }

      // Cerrar modal y limpiar estado solo después de que todo termine
      setIsTerminateModalOpen(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Error terminating contract:", error);

      addNotification(
        `Error terminating contract for ${selectedContract.nombreCompleto}. Please try again.`,
        "error"
      );

      // En caso de error, no cerrar el modal para que el usuario pueda reintentar
      throw error;
    }
  };

  const handleCancelContract = async (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;

    setSelectedContract(contract);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancellation = async (data: {
    motivo: string;
    observaciones?: string;
  }) => {
    if (!selectedContract) return;

    setIsCancellingContract(true);
    try {
      const result = await cancelarContrato(selectedContract.id, data);

      addNotification(
        result.message ||
          `Contract for ${selectedContract.nombreCompleto} cancelled successfully. You can now send a corrected contract.`,
        "success"
      );

      // Recargar contratos para ver los cambios
      try {
        await loadContracts();
      } catch (loadError) {
        console.error("Error reloading contracts:", loadError);
        addNotification(
          "Contract cancelled successfully but failed to reload the list. Please refresh the page.",
          "warning"
        );
      }

      // Cerrar modal y limpiar estado
      setIsCancelModalOpen(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Error cancelling contract:", error);

      addNotification(
        `Error cancelling contract for ${selectedContract.nombreCompleto}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsCancellingContract(false);
    }
  };

  const PaymentModal = ({
    contract,
    onClose,
  }: {
    contract: ProcesoContratacion;
    onClose: () => void;
  }) => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentYear = new Date().getFullYear();

    const currentPayment = contract.paymentHistory?.find(
      (p) => p.month === currentMonth && p.year === currentYear
    );

    const handleProcessPayment = async () => {
      try {
        // Aquí iría la lógica para procesar el pago
        console.log("Processing payment for contract:", contract.id);
        await loadContracts();
        onClose();
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Payment History - {contract.nombreCompleto}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Current Month ({currentMonth} {currentYear})
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">
                    Status: {currentPayment?.status || "pending"}
                  </p>
                  <p className="text-gray-600">
                    Evaluation: {currentPayment?.evaluationStatus || "pending"}
                  </p>
                  <p className="text-gray-600">
                    Amount: {contract.ofertaSalarial} {contract.monedaSalario}
                  </p>
                </div>
                {(!currentPayment || currentPayment.status === "pending") && (
                  <button
                    onClick={handleProcessPayment}
                    className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007B8F] transition-colors"
                  >
                    Process Payment
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Payment History
            </h3>
            <div className="space-y-2">
              {contract.paymentHistory?.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {payment.month} {payment.year}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      {payment.amount} {payment.currency}
                    </span>
                    {payment.status === "paid" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UploadContractModal = ({
    contract,
    onClose,
    onUpload,
  }: {
    contract: ProcesoContratacion;
    onClose: () => void;
    onUpload: () => Promise<void>;
  }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadNotes, setUploadNotes] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    };

    const handleUpload = async () => {
      if (!selectedFile) return;

      setLoading(true);
      try {
        // Llamar a la API para subir el contrato
        const result = await uploadFinalContract(contract.id, selectedFile);

        if (result.success) {
          addNotification(
            `Contract uploaded successfully for ${contract.nombreCompleto}`,
            "success"
          );
          await onUpload(); // Recargar los contratos
        } else {
          addNotification(
            `Failed to upload contract: ${result.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error uploading contract:", error);
        addNotification(
          "There was an error uploading the contract. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Final Contract - {contract.nombreCompleto}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Contract Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-600">
                Position: {contract.puestoTrabajo}
              </p>
              <p className="text-gray-600">
                Status: {contract.estadoContratacion}
              </p>
              <p className="text-gray-600">
                Signature Date:{" "}
                {contract.fechaFirma
                  ? new Date(contract.fechaFirma).toLocaleDateString()
                  : "Not signed yet"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Final Contract Document *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Notes (Optional)
            </label>
            <textarea
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              rows={3}
              placeholder="Add any notes about the final contract..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload Contract
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  console.log("[SORTED CONTRACTS]", sortedContracts);
  return (
    <div className="w-full max-w-screen-2xl mx-auto mt-8 flex flex-col h-screen">
      {/* Search Input */}
      <div className="mb-6 px-4 flex flex-col md:flex-row gap-3 md:px-0 md:justify-between md:items-center">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <input
            type="text"
            placeholder="Search by name or job position"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:flex-1 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          />
          <select
            value={selectedClient}
            onChange={handleClientFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          >
            <option value="">All Clients</option>
            {uniqueClients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info banner: where and when you can cancel contracts */}
      <div className="px-4 md:px-0 mb-4">
        <div className="flex items-start gap-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">How to cancel a contract</p>
            <p>
              Use the “Cancel” action in the Actions column for contracts that
              are not fully signed or finalized. You can cancel when status is:
              Pending Docs, Reading Docs, Docs Complete, Pending
              Candidate/Provider, Signed (partial), not
              Cancelled/Expired/Finalized.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-none mx-auto max-h-[90vh] flex flex-col"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Hiring Processes
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative p-6">
            {isLoading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : contracts.length > 0 ? (
              <>
                <div className="mb-4 text-gray-500 text-sm flex items-center justify-between">
                  <div>
                    Total: {filteredContracts.length} contracts
                    {selectedClient ? ` (${contracts.length} total)` : ""} |
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={exportToExcel}
                      disabled={isExporting}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        isExporting
                          ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                          : "bg-[#0097B2] text-white hover:bg-[#007B8F]"
                      }`}
                      title={
                        isExporting
                          ? `Exporting... ${exportProgress}%`
                          : "Export ALL contracts to Excel (from all pages)"
                      }
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                          Exporting {exportProgress}%
                        </>
                      ) : (
                        <>📊 Export All to Excel</>
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className="overflow-y-auto overflow-x-auto max-h-[calc(90vh-13rem)]"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#0097B2 #f3f4f6",
                  }}
                >
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-20 shadow-sm">
                      <tr className="border-b border-gray-200">
                        <th
                          className="text-left py-3 px-4 font-medium text-gray-700 w-1/8 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                          onClick={() => handleSort("nombreCompleto")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Candidate Name</span>
                            <div className="flex flex-col text-xs text-gray-400">
                              {sortKey === "nombreCompleto" &&
                              sortDirection === "asc" ? (
                                <span className="text-blue-600">▲</span>
                              ) : sortKey === "nombreCompleto" &&
                                sortDirection === "desc" ? (
                                <span className="text-blue-600">▼</span>
                              ) : (
                                <span className="opacity-50">⇅</span>
                              )}
                            </div>
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-medium text-gray-700 w-1/8 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                          onClick={() => handleSort("clienteNombre")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Client</span>
                            <div className="flex flex-col text-xs text-gray-400">
                              {sortKey === "clienteNombre" &&
                              sortDirection === "asc" ? (
                                <span className="text-blue-600">▲</span>
                              ) : sortKey === "clienteNombre" &&
                                sortDirection === "desc" ? (
                                <span className="text-blue-600">▼</span>
                              ) : (
                                <span className="opacity-50">⇅</span>
                              )}
                            </div>
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-medium text-gray-700 w-1/8 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                          onClick={() => handleSort("puestoTrabajo")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Position</span>
                            <div className="flex flex-col text-xs text-gray-400">
                              {sortKey === "puestoTrabajo" &&
                              sortDirection === "asc" ? (
                                <span className="text-blue-600">▲</span>
                              ) : sortKey === "puestoTrabajo" &&
                                sortDirection === "desc" ? (
                                <span className="text-blue-600">▼</span>
                              ) : (
                                <span className="opacity-50">⇅</span>
                              )}
                            </div>
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-medium text-gray-700 w-1/8 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                          onClick={() => handleSort("estadoContratacion")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Contract Status</span>
                            <div className="flex flex-col text-xs text-gray-400">
                              {sortKey === "estadoContratacion" &&
                              sortDirection === "asc" ? (
                                <span className="text-blue-600">▲</span>
                              ) : sortKey === "estadoContratacion" &&
                                sortDirection === "desc" ? (
                                <span className="text-blue-600">▼</span>
                              ) : (
                                <span className="opacity-50">⇅</span>
                              )}
                            </div>
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Documents Read
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Contract Annex
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Upload Contract
                        </th>
                        {/* <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Evaluations
                        </th> */}
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedContracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-gray-700">
                            {contract.nombreCompleto}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            <span className="px-2 py-1 text-blue-800 text-xs rounded-full">
                              {contract.clienteNombre || "No specified"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {contract.puestoTrabajo}
                          </td>
                          <td className="py-4 px-4">
                            {renderContractStatus(contract.estadoContratacion)}
                          </td>
                          <td className="py-4 px-4">
                            <DocumentReadStatus contract={contract} />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  setSelectedContractForAnnex(contract);
                                  setIsAnnexModalOpen(true);
                                }}
                                className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                              >
                                <PenTool size={16} className="mr-1" />
                                Add Annex
                              </button>
                              {contract.anexos &&
                                contract.anexos.length > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedContractForAnnexList(contract);
                                      setIsAnnexListModalOpen(true);
                                    }}
                                    className="text-gray-600 hover:text-gray-800 hover:underline flex items-center text-sm font-medium cursor-pointer"
                                  >
                                    <FileText size={16} className="mr-1" />
                                    View {contract.anexos.length} Annexes
                                  </button>
                                )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {contract.contratoFinalUrl ? (
                              // Ya se cargó el contrato final
                              <div
                                className="flex items-center space-x-2"
                                title="Contract uploaded"
                              >
                                <CheckCircle
                                  size={20}
                                  className="text-green-500"
                                />
                                <a
                                  href={contract.contratoFinalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0097B2] hover:underline text-sm font-medium"
                                >
                                  View Final Contract
                                </a>
                              </div>
                            ) : contract.estadoContratacion ===
                              "CONTRATO_FINALIZADO" ? (
                              // Puede cargar el contrato
                              <button
                                onClick={() =>
                                  handleUploadContract(contract.id)
                                }
                                className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007B8F] transition-colors flex items-center"
                                title="Upload final contract"
                              >
                                <Upload size={14} className="mr-1" />
                                Upload Contract
                              </button>
                            ) : (
                              // Esperando firma
                              <span className="text-gray-500 text-xs">
                                Pending signature
                              </span>
                            )}
                          </td>
                          {/* Evaluations Column - Comentado hasta enero */}
                          {/* <td className="py-4 px-4">
                            <button
                              onClick={() => handleViewEvaluaciones(contract)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center"
                              title="View monthly evaluations"
                            >
                              <DollarSign size={14} className="mr-1" />
                              {contract.evaluacionesPago?.length || 0} Evaluations
                            </button>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              {contract.estadoContratacion ===
                                EstadoContratacion.DOCUMENTOS_COMPLETADOS && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleSignContract(contract.id)
                                    }
                                    disabled={
                                      isSigningContract === contract.id ||
                                      contract.enviadoAlProveedor
                                    }
                                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center ${
                                      contract.enviadoAlProveedor
                                        ? "bg-green-500 text-white cursor-default"
                                        : isSigningContract === contract.id
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-[#0097B2] text-white hover:bg-[#007A8C] hover:shadow-md active:scale-95"
                                    }`}
                                    title={
                                      contract.enviadoAlProveedor
                                        ? `Contract already sent to provider${
                                            contract.fechaEnvioAlProveedor
                                              ? ` on ${new Date(
                                                  contract.fechaEnvioAlProveedor
                                                ).toLocaleDateString()}`
                                              : ""
                                          }`
                                        : "Send contract to provider for signature"
                                    }
                                  >
                                    {contract.enviadoAlProveedor ? (
                                      <>
                                        <CheckCircle
                                          size={12}
                                          className="mr-1"
                                        />
                                        Sent to Provider
                                      </>
                                    ) : isSigningContract === contract.id ? (
                                      <>
                                        <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <PenTool size={12} className="mr-1" />
                                        Send to Provider
                                      </>
                                    )}
                                  </button>

                                  {/* Botón de Reenviar - solo si ya se envió */}
                                  {contract.enviadoAlProveedor && (
                                    <button
                                      onClick={() =>
                                        handleResendContract(contract.id)
                                      }
                                      disabled={
                                        isSigningContract === contract.id
                                      }
                                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center ${
                                        isSigningContract === contract.id
                                          ? "bg-gray-400 text-white cursor-not-allowed"
                                          : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md active:scale-95"
                                      }`}
                                      title="Resend contract to provider (if they didn't receive it)"
                                    >
                                      {isSigningContract === contract.id ? (
                                        <>
                                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                          Resending...
                                        </>
                                      ) : (
                                        <>
                                          🔄
                                          <span className="ml-1">Resend</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Cancel Contract Button - for contracts that can be cancelled */}
                              {contract.estadoContratacion !==
                                EstadoContratacion.FIRMADO_COMPLETO &&
                                contract.estadoContratacion !==
                                  EstadoContratacion.CONTRATO_FINALIZADO &&
                                contract.estadoContratacion !==
                                  EstadoContratacion.CANCELADO &&
                                contract.estadoContratacion !==
                                  EstadoContratacion.EXPIRADO &&
                                contract.activo && (
                                  <button
                                    onClick={() =>
                                      handleCancelContract(contract.id)
                                    }
                                    className="px-2 py-1 bg-orange-600 text-white rounded-md text-xs font-medium hover:bg-orange-700 transition-all duration-200 flex items-center hover:shadow-md active:scale-95"
                                    title="Cancel Contract (for corrections)"
                                  >
                                    <XCircle size={12} className="mr-1" />
                                    Cancel
                                  </button>
                                )}

                              {contract.estadoContratacion ===
                                EstadoContratacion.CONTRATO_FINALIZADO &&
                                contract.activo && (
                                  <button
                                    onClick={() =>
                                      handleFinalizarContrato(contract.id)
                                    }
                                    className="px-2 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-all duration-200 flex items-center hover:shadow-md active:scale-95"
                                    title="Terminate Contract"
                                  >
                                    <XSquare size={12} className="mr-1" />
                                    Terminate
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No contracts found.
              </div>
            )}
          </div>

          {/* Footer controls: rows per page + pagination */}
          <div className="border-t border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Show</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              >
                {[15, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">per page</span>
            </div>
            <div className="inline-flex border border-gray-300 rounded-md">
              <button
                className={`px-3 py-1 text-[#0097B2] border-r border-gray-300 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="#0097B2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 ${
                    currentPage === index + 1
                      ? "text-white bg-[#0097B2]"
                      : "text-[#0097B2] hover:bg-gray-50"
                  }`}
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 text-[#0097B2] border-l border-gray-300 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#0097B2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="px-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Contract Processes
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : contracts.length > 0 ? (
            <>
              <div className="mb-4 text-gray-500 text-sm flex items-center justify-between">
                <div>
                  Total: {filteredContracts.length} contracts
                  {selectedClient ? ` (${contracts.length} total)` : ""} | Page{" "}
                  {currentPage} of {totalPages}
                </div>
                <div>
                  <button
                    onClick={exportToExcel}
                    disabled={isExporting}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      isExporting
                        ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                        : "bg-[#0097B2] text-white hover:bg-[#007B8F]"
                    }`}
                    title={
                      isExporting
                        ? `Exporting... ${exportProgress}%`
                        : "Export ALL contracts"
                    }
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                        {exportProgress}%
                      </>
                    ) : (
                      <>📊 Export All</>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {sortedContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="bg-white rounded-lg shadow-md p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">
                        {contract.nombreCompleto}
                      </h4>
                      {renderContractStatus(contract.estadoContratacion)}
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <span className="text-gray-600 font-bold">Client:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block">
                        {contract.clienteNombre || "No specified"}
                      </span>

                      <span className="text-gray-600 font-bold">Position:</span>
                      <span className="text-gray-700">
                        {contract.puestoTrabajo}
                      </span>

                      <span className="text-gray-600 font-bold">Docs:</span>
                      <DocumentReadStatus contract={contract} />

                      <span className="text-gray-600 font-bold">Sign:</span>
                      <div>
                        {contract.estadoContratacion ===
                          EstadoContratacion.CONTRATO_FINALIZADO &&
                        contract.signWellDownloadUrl ? (
                          <div className="flex items-center space-x-2">
                            <a
                              href={contract.signWellDownloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0097B2] hover:underline flex items-center text-sm font-medium"
                            >
                              <Download size={18} className="mr-1" />
                              PDF
                            </a>
                            <button
                              onClick={() =>
                                handleViewDocument(
                                  contract.signWellDownloadUrl!
                                )
                              }
                              className="text-[#0097B2] hover:underline flex items-center text-sm font-medium"
                              title="View document"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </div>

                      <span className="text-gray-600 font-bold">Upload:</span>
                      <div>
                        {contract.contratoFinalUrl ? (
                          // Ya se cargó el contrato final
                          <div
                            className="flex items-center space-x-2"
                            title="Contract uploaded"
                          >
                            <CheckCircle size={16} className="text-green-500" />
                            <a
                              href={contract.contratoFinalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0097B2] hover:underline text-xs font-medium"
                            >
                              View Final
                            </a>
                          </div>
                        ) : contract.estadoContratacion ===
                          "CONTRATO_FINALIZADO" ? (
                          // Puede cargar el contrato
                          <button
                            onClick={() => handleUploadContract(contract.id)}
                            className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007B8F] transition-colors flex items-center"
                            title="Upload final contract"
                          >
                            <Upload size={14} className="mr-1" />
                            Upload Contract
                          </button>
                        ) : (
                          // Esperando firma
                          <span className="text-gray-500 text-xs">
                            Pending signature
                          </span>
                        )}
                      </div>

                      {/* Evaluations - Comentado hasta enero */}
                      {/* <span className="text-gray-600 font-bold">
                        Evaluations:
                      </span>
                      <button
                        onClick={() => handleViewEvaluaciones(contract)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center justify-start"
                        title="View monthly evaluations"
                      >
                        <DollarSign size={14} className="mr-1" />
                        {contract.evaluacionesPago?.length || 0} Evaluations
                      </button> */}

                      <span className="text-gray-600 font-bold">Actions:</span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {contract.estadoContratacion ===
                          EstadoContratacion.DOCUMENTOS_COMPLETADOS && (
                          <>
                            <button
                              onClick={() => handleSignContract(contract.id)}
                              disabled={
                                isSigningContract === contract.id ||
                                contract.enviadoAlProveedor
                              }
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center ${
                                contract.enviadoAlProveedor
                                  ? "bg-green-500 text-white cursor-default"
                                  : isSigningContract === contract.id
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-[#0097B2] text-white hover:bg-[#007A8C] hover:shadow-md active:scale-95"
                              }`}
                              title={
                                contract.enviadoAlProveedor
                                  ? `Contract already sent to provider${
                                      contract.fechaEnvioAlProveedor
                                        ? ` on ${new Date(
                                            contract.fechaEnvioAlProveedor
                                          ).toLocaleDateString()}`
                                        : ""
                                    }`
                                  : "Send contract to provider for signature"
                              }
                            >
                              {contract.enviadoAlProveedor ? (
                                <>
                                  <CheckCircle size={14} className="mr-1" />
                                  Sent to Provider
                                </>
                              ) : isSigningContract === contract.id ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <PenTool size={14} className="mr-1" />
                                  Send to Provider
                                </>
                              )}
                            </button>

                            {/* Botón de Reenviar - móvil */}
                            {contract.enviadoAlProveedor && (
                              <button
                                onClick={() =>
                                  handleResendContract(contract.id)
                                }
                                disabled={isSigningContract === contract.id}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center ${
                                  isSigningContract === contract.id
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md active:scale-95"
                                }`}
                                title="Resend contract to provider"
                              >
                                {isSigningContract === contract.id ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                    Resending...
                                  </>
                                ) : (
                                  <>
                                    🔄
                                    <span className="ml-1">Resend</span>
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        )}

                        {/* Cancel Contract Button - mobile view */}
                        {contract.estadoContratacion !==
                          EstadoContratacion.FIRMADO_COMPLETO &&
                          contract.estadoContratacion !==
                            EstadoContratacion.CONTRATO_FINALIZADO &&
                          contract.estadoContratacion !==
                            EstadoContratacion.CANCELADO &&
                          contract.estadoContratacion !==
                            EstadoContratacion.EXPIRADO &&
                          contract.activo && (
                            <button
                              onClick={() => handleCancelContract(contract.id)}
                              className="px-3 py-1 bg-orange-600 text-white rounded-md text-xs font-medium hover:bg-orange-700 transition-all duration-200 flex items-center hover:shadow-md active:scale-95"
                              title="Cancel Contract (for corrections)"
                            >
                              <XCircle size={14} className="mr-1" />
                              Cancel
                            </button>
                          )}

                        {contract.estadoContratacion ===
                          EstadoContratacion.CONTRATO_FINALIZADO &&
                          contract.activo && (
                            <button
                              onClick={() =>
                                handleFinalizarContrato(contract.id)
                              }
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-all duration-200 flex items-center hover:shadow-md active:scale-95"
                            >
                              <XSquare size={14} className="mr-1" />
                              Terminate
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination for mobile */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex border border-gray-300 rounded-md">
                    <button
                      className={`px-3 py-1 text-[#0097B2] border-r border-gray-300 ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50 cursor-pointer"
                      }`}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="#0097B2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <span className="px-3 py-1 text-[#0097B2]">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      className={`px-3 py-1 text-[#0097B2] border-l border-gray-300 ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50 cursor-pointer"
                      }`}
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="#0097B2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 mt-4">
              No contracts found.
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedContract && (
        <PaymentModal
          contract={selectedContract}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedContract(null);
          }}
        />
      )}

      {/* Upload Contract Modal */}
      {isUploadModalOpen && selectedContract && (
        <UploadContractModal
          contract={selectedContract}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedContract(null);
          }}
          onUpload={async () => {
            await loadContracts();
            setIsUploadModalOpen(false);
            setSelectedContract(null);
          }}
        />
      )}

      {/* Terminate Contract Modal */}
      {isTerminateModalOpen && selectedContract && (
        <TerminateContractModal
          contract={selectedContract}
          onClose={() => {
            setIsTerminateModalOpen(false);
            setSelectedContract(null);
          }}
          onConfirm={handleConfirmTermination}
        />
      )}

      {/* Cancel Contract Modal */}
      {isCancelModalOpen && selectedContract && (
        <CancelContractModal
          isOpen={isCancelModalOpen}
          contract={selectedContract}
          onClose={() => {
            setIsCancelModalOpen(false);
            setSelectedContract(null);
          }}
          onConfirm={handleConfirmCancellation}
          isSubmitting={isCancellingContract}
        />
      )}

      {/* Send Annex Modal */}
      {isAnnexModalOpen && selectedContractForAnnex && (
        <SendAnnexModal
          isOpen={isAnnexModalOpen}
          contract={selectedContractForAnnex}
          onClose={() => {
            setIsAnnexModalOpen(false);
            setSelectedContractForAnnex(null);
          }}
          onAnnexSent={() => {
            // Refresh contracts or show notification
            loadContracts();
          }}
        />
      )}

      {/* Annexes List Modal */}
      {isAnnexListModalOpen && selectedContractForAnnexList && (
        <AnnexesListModal
          isOpen={isAnnexListModalOpen}
          onClose={() => {
            setIsAnnexListModalOpen(false);
            setSelectedContractForAnnexList(null);
          }}
          candidateName={selectedContractForAnnexList.nombreCompleto}
          annexes={selectedContractForAnnexList.anexos || []}
        />
      )}
    </div>
  );
}
