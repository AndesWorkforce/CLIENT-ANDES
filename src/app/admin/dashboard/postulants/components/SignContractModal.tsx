"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { X, FileText, Send, Eye, Loader2 } from "lucide-react";
import { SERVICIOS_DISPONIBLES, CATEGORIAS_SERVICIOS } from "./templates";
import {
  sendContractToSignWell,
  SendContractPayload,
} from "../../actions/contracts.actions";
import { sendContractSentNotification } from "../../actions/sendEmail.actions";
import StatementOfWorkPDF from "./templates/StatementOfWorkPDF";
import StatementOfWorkEnglishPDF from "./templates/StatementOfWorkEnglishPDF";
import { Applicant } from "../../../../types/applicant";
import { useNotificationStore } from "@/store/notifications.store";

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  variables: string[];
  component: string;
  category: string;
}

interface SignContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant;
}

// Componente simplificado para el preview del PDF
const PDFPreview = React.memo(
  ({
    selectedTemplate,
    contractData,
  }: {
    selectedTemplate: ContractTemplate | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contractData: any;
  }) => {
    const [pdfBlob, setPdfBlob] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePDF = useCallback(async () => {
      if (!selectedTemplate || !contractData) return;

      setIsLoading(true);
      setError(null);

      try {
        const { pdf } = await import("@react-pdf/renderer");

        let pdfDocument;
        if (selectedTemplate.id === "english-contract") {
          pdfDocument = <StatementOfWorkEnglishPDF data={contractData} />;
        } else {
          pdfDocument = <StatementOfWorkPDF data={contractData} />;
        }

        const blob = await pdf(pdfDocument).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfBlob(url);
      } catch (err) {
        console.error("Error generating PDF:", err);
        setError("Error al generar el PDF");
      } finally {
        setIsLoading(false);
      }
    }, [selectedTemplate?.id, contractData]);

    useEffect(() => {
      generatePDF();

      return () => {
        if (pdfBlob) {
          URL.revokeObjectURL(pdfBlob);
        }
      };
    }, [generatePDF]);

    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0097B2]" />
            <p className="text-gray-600">Generando vista previa...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center bg-red-50">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    if (!pdfBlob) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FileText className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Preparando vista previa...</p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        src={pdfBlob}
        className="w-full h-full border-0 rounded-lg"
        title="PDF Preview"
        style={{ minHeight: "500px" }}
      />
    );
  }
);

PDFPreview.displayName = "PDFPreview";

// Funciones auxiliares para labels y placeholders
const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    nombreCompleto: "Full Name",
    correoElectronico: "Email Address",
    cedula: "ID/SSN",
    telefono: "Phone Number",
    direccionCompleta: "Full Address",
    nacionalidad: "Nationality",
    puestoTrabajo: "Job Position",
    descripcionServicios: "Service Description",
    ofertaSalarial: "Final Salary",
    salarioProbatorio: "Probationary Salary",
    monedaSalario: "Currency",
    fechaInicioLabores: "Start Date",
    fechaEjecucion: "Execution Date",
    nombreBanco: "Bank Name",
    numeroCuenta: "Account Number",
  };

  const requiredFields = [
    "nombreCompleto",
    "correoElectronico",
    "cedula",
    "telefono",
    "direccionCompleta",
    "nacionalidad",
  ];
  const label = labels[field] || field.charAt(0).toUpperCase() + field.slice(1);

  return requiredFields.includes(field) ? `${label} *` : label;
};

const getFieldPlaceholder = (field: string): string => {
  const placeholders: Record<string, string> = {
    nombreCompleto: "e.g., Ana Yarely Chávez",
    correoElectronico: "e.g., ana.chavez@email.com",
    cedula: "e.g., 12345678901",
    telefono: "e.g., +1 (555) 123-4567",
    direccionCompleta: "e.g., 123 Main St, City, State, ZIP",
    nacionalidad: "e.g., Colombian, American, etc.",
    puestoTrabajo: "e.g., Administrative Assistant",
    descripcionServicios: "Detailed description of responsibilities...",
    ofertaSalarial: "1100",
    salarioProbatorio: "1000",
    monedaSalario: "USD",
    nombreBanco: "e.g., Bank of America",
    numeroCuenta: "e.g., 1234567890",
  };
  return placeholders[field] || `Enter ${field}`;
};

export default function SignContractModal({
  isOpen,
  onClose,
  applicant,
}: SignContractModalProps) {
  const { addNotification } = useNotificationStore();
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Lista de templates disponibles
  const contractTemplates = useMemo((): ContractTemplate[] => {
    const workingTemplates: ContractTemplate[] = [];

    // Agregar contrato en inglés como primera opción
    workingTemplates.push({
      id: "english-contract",
      name: "English Contract (Statement of Work + Professional Services + Confidentiality)",
      description:
        "Complete English contract package including Statement of Work, Professional Services Agreement, and Confidentiality Agreement for international contractors.",
      subject:
        "Statement of Work - {{nombreCompleto}} - English Contract Package",
      component: "StatementOfWorkEnglishPDF",
      category: "International",
      variables: [
        "nombreCompleto",
        "correoElectronico",
        "cedula",
        "telefono",
        "direccionCompleta",
        "nacionalidad",
        "puestoTrabajo",
        "descripcionServicios",
        "ofertaSalarial",
        "salarioProbatorio",
        "monedaSalario",
        "fechaInicioLabores",
        "fechaEjecucion",
        "nombreBanco",
        "numeroCuenta",
      ],
    });

    // Agregar servicios específicos
    Object.entries(SERVICIOS_DISPONIBLES).forEach(([key, servicio]) => {
      if (key === "ENGLISH_SERVICE_AGREEMENT") {
        return;
      }

      workingTemplates.push({
        id: key.toLowerCase().replace(/_/g, "-"),
        name: servicio.nombre,
        description: servicio.descripcion,
        subject: `Statement of Work - {{nombreCompleto}} - ${servicio.nombre}`,
        component: "StatementOfWorkPDF",
        category:
          Object.values(CATEGORIAS_SERVICIOS).find((cat) =>
            cat.servicios.includes(key)
          )?.nombre || "Otros",
        variables: [
          "nombreCompleto",
          "correoElectronico",
          "cedula",
          "telefono",
          "direccionCompleta",
          "nacionalidad",
          "puestoTrabajo",
          "descripcionServicios",
          "ofertaSalarial",
          "salarioProbatorio",
          "monedaSalario",
          "fechaInicioLabores",
          "fechaEjecucion",
        ],
      });
    });

    return workingTemplates;
  }, []);

  // Datos del contrato - MEMOIZADO para evitar re-renders infinitos
  const [contractData, setContractData] = useState(() => ({
    nombreCompleto: `${applicant.nombre} ${applicant.apellido}`,
    correoElectronico: applicant.correo,
    cedula: "",
    telefono: applicant.telefono || "",
    nacionalidad: applicant.pais || "",
    direccionCompleta: "",
    puestoTrabajo:
      applicant.lastRelevantPostulacion?.titulo || "Administrative Assistant",
    descripcionServicios:
      "Serves as the first point of contact for new or prospective clients. Responsible for gathering initial case information, verifying basic eligibility, and entering client details into internal systems.",
    ofertaSalarial: "1100",
    salarioProbatorio: "1000",
    monedaSalario: "USD",
    fechaInicioLabores: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    fechaEjecucion: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    nombreBanco: "",
    numeroCuenta: "",
  }));

  // Memoizar los datos procesados para el PDF
  const memoizedPDFData = useMemo(
    () => ({
      ...contractData,
      nombreCompleto: contractData.nombreCompleto || "Contractor Name",
      correoElectronico:
        contractData.correoElectronico || "contractor@email.com",
      cedula: contractData.cedula || "000000000",
      telefono: contractData.telefono || "000-000-0000",
      nacionalidad: contractData.nacionalidad || "Unknown",
      direccionCompleta:
        contractData.direccionCompleta || "Address not provided",
      puestoTrabajo: contractData.puestoTrabajo || "Professional Services",
      descripcionServicios:
        contractData.descripcionServicios ||
        "Professional services to be provided",
      ofertaSalarial: contractData.ofertaSalarial || "0",
      salarioProbatorio: contractData.salarioProbatorio || "0",
      monedaSalario: contractData.monedaSalario || "USD",
      nombreBanco: contractData.nombreBanco || "Bank Name",
      numeroCuenta: contractData.numeroCuenta || "Account Number",
      fechaEjecucion:
        contractData.fechaEjecucion ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      fechaInicioLabores:
        contractData.fechaInicioLabores ||
        new Date().toISOString().split("T")[0],
    }),
    [contractData]
  );

  // Inicializar template cuando se abre el modal
  useEffect(() => {
    if (isOpen && contractTemplates.length > 0 && !selectedTemplate) {
      const firstTemplate = contractTemplates[0];
      setSelectedTemplate(firstTemplate);
      setContractData((prev) => ({
        ...prev,
        descripcionServicios:
          firstTemplate.description || prev.descripcionServicios,
      }));
    }
  }, [isOpen, contractTemplates, selectedTemplate]);

  // Reset cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedTemplate(null);
      setValidationErrors([]);
    }
  }, [isOpen]);

  const handleTemplateChange = (template: ContractTemplate) => {
    setValidationErrors([]);
    setSelectedTemplate(template);
    setContractData((prev) => ({
      ...prev,
      descripcionServicios: template.description || prev.descripcionServicios,
      puestoTrabajo:
        template.name !== prev.puestoTrabajo
          ? template.name
          : prev.puestoTrabajo,
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setContractData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const formatDateWithOrdinal = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  const replaceVariables = (content: string) => {
    let result = content;
    Object.entries(contractData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      if (key === "fechaInicioLabores" && value) {
        result = result.replace(regex, formatDateWithOrdinal(value.toString()));
      } else {
        result = result.replace(regex, value);
      }
    });
    return result;
  };

  const validateRequiredFields = () => {
    const errors: string[] = [];
    const requiredFields = ["nombreCompleto", "correoElectronico"];

    requiredFields.forEach((field) => {
      if (
        !contractData[field as keyof typeof contractData] ||
        contractData[field as keyof typeof contractData].toString().trim() ===
          ""
      ) {
        errors.push(`${getFieldLabel(field)} is required`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSendContract = async () => {
    if (!selectedTemplate || !applicant.lastRelevantPostulacion?.id) return;

    if (!validateRequiredFields()) {
      return;
    }

    setIsLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");

      let pdfDocument;
      if (selectedTemplate.id === "english-contract") {
        pdfDocument = <StatementOfWorkEnglishPDF data={memoizedPDFData} />;
      } else {
        pdfDocument = <StatementOfWorkPDF data={memoizedPDFData} />;
      }

      const pdfBlob = await pdf(pdfDocument).toBlob();

      const base64Content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(pdfBlob);
      });

      const contractPayload: SendContractPayload = {
        nombreCompleto: contractData.nombreCompleto,
        puestoTrabajo: contractData.puestoTrabajo,
        ofertaSalarial: parseFloat(contractData.ofertaSalarial),
        monedaSalario: contractData.monedaSalario,
        fechaInicioLabores: new Date(contractData.fechaInicioLabores),
        archivoBase64: base64Content,
        nombreArchivo: `statement_of_work_${applicant.nombre}_${applicant.apellido}.pdf`,
        urlRedirect: `${window.location.origin}/admin/dashboard/contracts/callback`,
      };

      const result = await sendContractToSignWell(
        applicant.lastRelevantPostulacion.id,
        contractPayload
      );

      if (result.success) {
        if (result.signingUrls && result.signingUrls.length > 0) {
          const candidateUrl = result.signingUrls.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (signer: any) =>
              signer.name === contractData.nombreCompleto ||
              signer.email === contractData.correoElectronico
          );

          if (candidateUrl?.signingUrl) {
            window.open(candidateUrl.signingUrl, "_blank");
          }
        }

        addNotification(
          "Contract sent successfully! The signing window has been opened for the candidate.",
          "success"
        );

        try {
          const emailResponse = await sendContractSentNotification(
            contractData.nombreCompleto,
            contractData.correoElectronico
          );

          if (emailResponse.success) {
            addNotification(
              "Contract notification email sent to candidate.",
              "success"
            );
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }

        onClose();
      } else {
        addNotification(`Error sending contract: ${result.message}`, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification(
        "An unexpected error occurred while sending the contract.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Send contract to {applicant.nombre} {applicant.apellido}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Templates */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Contract Templates
            </h3>

            <div className="space-y-3">
              {contractTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateChange(template)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-[#0097B2] bg-[#0097B2]/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      {template.name}
                    </h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <p
                    className="text-sm text-gray-600 mt-1 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {template.description ||
                      "Personaliza la descripción según tus necesidades"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Subject:</strong> {template.subject}
                  </p>
                </div>
              ))}
            </div>

            {/* Contract Data Form */}
            {selectedTemplate && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Contract Data
                </h4>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h5 className="text-sm font-semibold text-red-800 mb-2">
                      Please fill in all required fields:
                    </h5>
                    <ul className="text-xs text-red-700 list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Personal Data */}
                  <div className="border-b border-[#0097B2] pb-3">
                    <h5 className="text-sm font-semibold text-[#0097B2] mb-2">
                      Personal Information *
                    </h5>
                    {[
                      "nombreCompleto",
                      "correoElectronico",
                      "cedula",
                      "telefono",
                      "nacionalidad",
                    ].map(
                      (field) =>
                        selectedTemplate.variables.includes(field) && (
                          <div key={field} className="mb-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {getFieldLabel(field)}
                            </label>
                            <input
                              type="text"
                              value={
                                contractData[
                                  field as keyof typeof contractData
                                ] || ""
                              }
                              onChange={(e) =>
                                handleInputChange(field, e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                              placeholder={getFieldPlaceholder(field)}
                            />
                          </div>
                        )
                    )}
                  </div>

                  {/* Position Data */}
                  <div className="border-b border-[#0097B2] pb-3">
                    <h5 className="text-sm font-semibold text-gray-600 mb-2">
                      Position Information
                    </h5>
                    {["puestoTrabajo", "descripcionServicios"].map(
                      (field) =>
                        selectedTemplate.variables.includes(field) && (
                          <div key={field} className="mb-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {getFieldLabel(field)}
                            </label>
                            {field === "descripcionServicios" ? (
                              <textarea
                                value={
                                  contractData[
                                    field as keyof typeof contractData
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(field, e.target.value)
                                }
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            ) : (
                              <input
                                type="text"
                                value={
                                  contractData[
                                    field as keyof typeof contractData
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(field, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            )}
                          </div>
                        )
                    )}
                  </div>

                  {/* Salary Data */}
                  <div className="border-b border-[#0097B2] pb-3">
                    <h5 className="text-sm font-semibold text-gray-600 mb-2">
                      Salary Information
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "salarioProbatorio",
                        "ofertaSalarial",
                        "monedaSalario",
                      ].map(
                        (field) =>
                          selectedTemplate.variables.includes(field) && (
                            <div key={field} className="mb-2">
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {getFieldLabel(field)}
                              </label>
                              <input
                                type={
                                  field.includes("salario") ||
                                  field.includes("Salarial")
                                    ? "number"
                                    : "text"
                                }
                                value={
                                  contractData[
                                    field as keyof typeof contractData
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(field, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            </div>
                          )
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="border-b border-[#0097B2] pb-3">
                    <h5 className="text-sm font-semibold text-gray-600 mb-2">
                      Dates
                    </h5>
                    {["fechaInicioLabores"].map(
                      (field) =>
                        selectedTemplate.variables.includes(field) && (
                          <div key={field} className="mb-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {getFieldLabel(field)}
                            </label>
                            <input
                              type="date"
                              value={
                                contractData[
                                  field as keyof typeof contractData
                                ] || ""
                              }
                              onChange={(e) =>
                                handleInputChange(field, e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                            />
                          </div>
                        )
                    )}
                  </div>

                  {/* English Contract Specific Fields */}
                  {selectedTemplate.id === "english-contract" && (
                    <div className="border-b border-[#0097B2] pb-3">
                      <h5 className="text-sm font-semibold text-gray-600 mb-2">
                        Banking Information (Required for English Contract)
                      </h5>
                      {["nombreBanco", "numeroCuenta", "direccionCompleta"].map(
                        (field) => (
                          <div key={field} className="mb-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {getFieldLabel(field)}
                            </label>
                            {field === "direccionCompleta" ? (
                              <textarea
                                value={
                                  contractData[
                                    field as keyof typeof contractData
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(field, e.target.value)
                                }
                                rows={2}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            ) : (
                              <input
                                type="text"
                                value={
                                  contractData[
                                    field as keyof typeof contractData
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(field, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Preview */}
          <div className="w-full lg:flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Preview</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Eye size={16} className="mr-1" />
                Contract preview
              </div>
            </div>

            {selectedTemplate ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {/* Subject Preview */}
                <div className="mb-6 pb-4 border-b border-[#0097B2]">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Subject:
                  </h4>
                  <p className="text-lg font-semibold text-gray-800">
                    {replaceVariables(selectedTemplate.subject)}
                  </p>
                </div>

                {/* PDF Preview */}
                <div className="bg-white rounded border shadow-sm">
                  <div className="h-[600px] border rounded-lg overflow-hidden">
                    <Suspense
                      fallback={
                        <div className="h-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[#0097B2]" />
                        </div>
                      }
                    >
                      <PDFPreview
                        selectedTemplate={selectedTemplate}
                        contractData={memoizedPDFData}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4" />
                  <p>Select a template to view preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendContract}
            disabled={!selectedTemplate || isLoading}
            className="px-6 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Contract
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
