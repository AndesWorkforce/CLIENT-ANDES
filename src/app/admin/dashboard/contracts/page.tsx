"use client";

import { useEffect, useState } from "react";
import {
  getContracts,
  getEvaluacionesMensuales,
} from "./actions/contracts.actions";
import {
  ProcesoContratacion,
  EstadoContratacion,
  EvaluacionPagoMensual,
} from "./interfaces/contracts.interface";
import {
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  PenTool,
  Upload,
  Eye,
  DollarSign,
} from "lucide-react";
import TableSkeleton from "../components/TableSkeleton";
import { sendProviderContractEmail } from "@/app/pages/contact/actions/microsoft-email-actions";

// Using imported interfaces from ./interfaces/contracts.interface.ts

// Componente auxiliar para manejar la carga asíncrona del estado de documentos leídos
interface DocumentReadStatusProps {
  contract: ProcesoContratacion;
}

const DocumentReadStatus = ({ contract }: DocumentReadStatusProps) => {
  return (
    <span
      className={`px-2 py-1 ${
        contract.readCompleted
          ? "bg-[#E6F4F6] text-[#0097B2]"
          : "bg-yellow-100 text-yellow-800"
      } text-xs rounded-full`}
    >
      {contract.readCompleted ? "Yes" : `${contract.documentReadPercentage}%`}
    </span>
  );
};

export default function ContractsPage() {
  const CONTRACTS_PER_PAGE = 7;
  const [contracts, setContracts] = useState<ProcesoContratacion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedContract, setSelectedContract] =
    useState<ProcesoContratacion | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEvaluacionesModalOpen, setIsEvaluacionesModalOpen] = useState(false);
  const [evaluacionesMensuales, setEvaluacionesMensuales] = useState<
    EvaluacionPagoMensual[]
  >([]);
  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(false);
  const [contractDocumentReadStatus] = useState<Record<string, boolean>>({});

  console.log(
    isEvaluacionesModalOpen,
    evaluacionesMensuales,
    loadingEvaluaciones
  );

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const response = await getContracts(
        currentPage,
        CONTRACTS_PER_PAGE,
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
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
        colorClass = "bg-gray-100 text-gray-600";
        text = "Pending Docs";
        break;
      case EstadoContratacion.DOCUMENTOS_EN_LECTURA:
        colorClass = "bg-[#E6F4F6] text-[#0097B2]";
        text = "In Reading";
        break;
      case EstadoContratacion.DOCUMENTOS_COMPLETADOS:
        colorClass = "bg-[#E6F4F6] text-[#0097B2]";
        text = "Docs Complete";
        break;
      case EstadoContratacion.PENDIENTE_FIRMA:
        colorClass = "bg-gray-100 text-gray-600";
        text = "Pending Signature";
        break;
      case EstadoContratacion.FIRMADO:
        colorClass = "bg-[#E6F4F6] text-[#0097B2]";
        text = "Signed";
        break;
      case EstadoContratacion.CONTRATO_FINALIZADO:
        colorClass = "bg-gray-100 text-gray-800";
        text = "Completed";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-800";
        text = "Unknown";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs uppercase ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  // const handleDocumentReadStatusChange = (
  //   contractId: string,
  //   status: boolean
  // ) => {
  //   setContractDocumentReadStatus((prev) => ({
  //     ...prev,
  //     [contractId]: status,
  //   }));
  // };

  const handleSignContract = async (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;

    try {
      // Send email to provider
      const emailResult = await sendProviderContractEmail({
        id: contract.id,
        nombreCompleto: contract.nombreCompleto,
        signWellUrlProveedor: contract.signWellUrlProveedor || null,
        fechaFirmaProveedor: contract.fechaFirmaProveedor
          ? new Date(contract.fechaFirmaProveedor)
          : null,
        estadoContratacion: contract.estadoContratacion,
      });

      if (emailResult.success) {
        alert(
          "Contract documents have been sent to the provider successfully."
        );
        // Reload contracts to update status
        await loadContracts();
      } else {
        alert(`Failed to send documents: ${emailResult.message}`);
      }
    } catch (error) {
      console.error("Error in handleSignContract:", error);
      alert("There was an error sending the documents to the provider.");
    }
  };

  const handleUploadContract = async (contractId: string) => {
    setSelectedContract(contracts.find((c) => c.id === contractId) || null);
    setIsUploadModalOpen(true);
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  const handleViewEvaluaciones = async (contract: ProcesoContratacion) => {
    setSelectedContract(contract);
    setLoadingEvaluaciones(true);
    setIsEvaluacionesModalOpen(true);

    try {
      const response = await getEvaluacionesMensuales(contract.id);
      if (response.success && response.data) {
        setEvaluacionesMensuales(response.data.data || []);
      } else {
        setEvaluacionesMensuales([]);
      }
    } catch (error) {
      console.error("Error loading evaluaciones:", error);
      setEvaluacionesMensuales([]);
    } finally {
      setLoadingEvaluaciones(false);
    }
  };

  // const handleUpdateRevision = async (
  //   evaluacionId: string,
  //   pagoHabilitado: boolean,
  //   observaciones: string
  // ) => {
  //   try {
  //     const response = await updateRevisionEvaluacion(evaluacionId, {
  //       pagoHabilitado,
  //       observacionesRevision: observaciones,
  //     });

  //     if (response.success) {
  //       // Recargar las evaluaciones
  //       if (selectedContract) {
  //         handleViewEvaluaciones(selectedContract);
  //       }
  //       alert("Revisión actualizada correctamente");
  //     } else {
  //       alert(`Error: ${response.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating revision:", error);
  //     alert("Error al actualizar la revisión");
  //   }
  // };

  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "APPROVED":
  //       return (
  //         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
  //           Aprobado
  //         </span>
  //       );
  //     case "REJECTED":
  //       return (
  //         <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
  //           Rechazado
  //         </span>
  //       );
  //     default:
  //       return (
  //         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
  //           Pendiente
  //         </span>
  //       );
  //   }
  // };

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
        // Aquí iría la llamada a la API para subir el contrato
        console.log(
          "Uploading contract:",
          contract.id,
          "File:",
          selectedFile.name,
          "Notes:",
          uploadNotes
        );
        await onUpload();
      } catch (error) {
        console.error("Error uploading contract:", error);
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

  console.log(`\n\n\n [CONTRACTS] contracts`, contracts, "\n\n\n");

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 flex flex-col h-screen">
      {/* Search Input */}
      <div className="mb-6 px-4 flex flex-col md:flex-row gap-3 md:px-0 md:justify-between md:items-center">
        <input
          type="text"
          placeholder="Search by name or job position"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-7xl mx-auto max-h-[90vh] flex flex-col"
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
                <div className="mb-4 text-gray-500 text-sm">
                  Total: {contracts.length} contracts | Page {currentPage} of{" "}
                  {totalPages}
                </div>

                <div
                  className="overflow-y-auto max-h-[calc(90vh-13rem)]"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#0097B2 #f3f4f6",
                  }}
                >
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-20 shadow-sm">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Candidate Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Position
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Contract Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Documents Read
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Signed Contract
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                          Upload Contract
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-gray-700">
                            {contract.nombreCompleto}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {contract.correo}
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
                            {contract.estadoContratacion ===
                              "CONTRATO_FINALIZADO" &&
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
                          </td>
                          <td className="py-4 px-4">
                            {contract.estadoContratacion ===
                            "CONTRATO_FINALIZADO" ? (
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
                              <span className="text-gray-500 text-xs">
                                Pending signature
                              </span>
                            )}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 p-4 flex justify-center">
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
          )}
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
              <div className="mb-4 text-gray-500 text-sm">
                Total: {contracts.length} contracts | Page {currentPage} of{" "}
                {totalPages}
              </div>

              <div className="space-y-4">
                {contracts.map((contract) => (
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
                      <span className="text-gray-600 font-bold">Email:</span>
                      <span className="text-gray-700">{contract.correo}</span>

                      <span className="text-gray-600 font-bold">Position:</span>
                      <span className="text-gray-700">
                        {contract.puestoTrabajo}
                      </span>

                      <span className="text-gray-600 font-bold">Docs:</span>
                      <DocumentReadStatus contract={contract} />

                      <span className="text-gray-600 font-bold">Sign:</span>
                      <div>
                        {contract.estadoContratacion ===
                          "DOCUMENTOS_COMPLETADOS" &&
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
                        {contract.estadoContratacion ===
                        "DOCUMENTOS_COMPLETADOS" ? (
                          <button
                            onClick={() => handleUploadContract(contract.id)}
                            className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007B8F] transition-colors flex items-center"
                            title="Upload final contract"
                          >
                            <Upload size={14} className="mr-1" />
                            Upload Contract
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">
                            Pending signature
                          </span>
                        )}
                      </div>

                      <span className="text-gray-600 font-bold">
                        Evaluations:
                      </span>
                      <button
                        onClick={() => handleViewEvaluaciones(contract)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center justify-start"
                        title="View monthly evaluations"
                      >
                        <DollarSign size={14} className="mr-1" />
                        {contract.evaluacionesPago?.length || 0} Evaluations
                      </button>
                    </div>

                    {/* Botones adicionales si son necesarios para acciones específicas */}
                    {contractDocumentReadStatus[contract.id] && (
                      <div className="pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleSignContract(contract.id)}
                          className="w-full px-3 py-2 bg-[#0097B2] text-white text-sm rounded-md hover:bg-[#007B8F] transition-colors flex items-center justify-center"
                        >
                          <PenTool size={16} className="mr-2" />
                          Sign
                        </button>
                      </div>
                    )}
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
    </div>
  );
}
