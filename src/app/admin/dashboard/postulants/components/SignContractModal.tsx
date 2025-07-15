"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, FileText, Send, Eye } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import { SERVICIOS_DISPONIBLES, CATEGORIAS_SERVICIOS } from "./templates";
import {
  sendContractToSignWell,
  SendContractPayload,
} from "../../actions/contracts.actions";
import { sendContractSentNotification } from "../../actions/sendEmail.actions";
import StatementOfWorkPDF from "./templates/StatementOfWorkPDF";
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

// Componente separado para el preview del PDF - simplificado para evitar errores con React 19
const PDFPreview: React.FC<{
  selectedTemplate: ContractTemplate;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contractData: any;
}> = ({ selectedTemplate, contractData }) => {
  const [pdfKey, setPdfKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Forzar re-render cuando cambie el template
  useEffect(() => {
    setIsVisible(false);
    setPdfKey((prev) => prev + 1);

    // Pequeño delay para evitar conflictos de render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedTemplate.id]);

  if (!isVisible) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097B2] mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading PDF preview...</p>
        </div>
      </div>
    );
  }

  // Solo usar StatementOfWorkPDF para evitar problemas con React 19
  return (
    <PDFViewer
      key={pdfKey}
      width="100%"
      height="100%"
      showToolbar={false}
      className="border-0"
    >
      <StatementOfWorkPDF data={contractData} />
    </PDFViewer>
  );
};

export default function SignContractModal({
  isOpen,
  onClose,
  applicant,
}: SignContractModalProps) {
  const { addNotification } = useNotificationStore();
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("custom");
  console.log(selectedServiceId);
  // Lista simplificada de templates que funcionan correctamente
  const contractTemplates = useMemo((): ContractTemplate[] => {
    // Eliminar el template estándar, solo dejar los específicos y el custom
    const workingTemplates: ContractTemplate[] = [];

    // Agregar servicios específicos
    Object.entries(SERVICIOS_DISPONIBLES).forEach(([key, servicio]) => {
      workingTemplates.push({
        id: key.toLowerCase().replace(/_/g, "-"),
        name: servicio.nombre,
        description: servicio.descripcion,
        subject: `Statement of Work - {{nombreCompleto}} - ${servicio.nombre}`,
        component: "StatementOfWorkPDF", // O el template correspondiente
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

  const [contractData, setContractData] = useState(() => ({
    // Datos básicos del empleado
    nombreCompleto: `${applicant.nombre} ${applicant.apellido}`,
    correoElectronico: applicant.correo,
    cedula: "",
    telefono: applicant.telefono || "",
    nacionalidad: applicant.pais || "",

    // Datos del puesto
    puestoTrabajo:
      applicant.lastRelevantPostulacion?.titulo || "Administrative Assistant",
    descripcionServicios:
      "Serves as the first point of contact for new or prospective clients. Responsible for gathering initial case information, verifying basic eligibility, and entering client details into internal systems.",

    // Datos salariales
    ofertaSalarial: "1100",
    salarioProbatorio: "1000",
    monedaSalario: "USD",

    // Fechas
    fechaInicioLabores: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 2 weeks from today
    fechaEjecucion: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && contractTemplates.length > 0) {
      setSelectedTemplate(contractTemplates[0]);
      // Actualizar la descripción de servicios según el template seleccionado
      setContractData((prev) => ({
        ...prev,
        descripcionServicios: contractTemplates[0].description,
      }));
    }
  }, [isOpen]);

  // Función para manejar el cambio de template y actualizar la descripción automáticamente
  const handleTemplateChange = (template: ContractTemplate) => {
    setSelectedTemplate(template);

    // Actualizar automáticamente la descripción de servicios
    setContractData((prev) => ({
      ...prev,
      descripcionServicios: template.description,
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setContractData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Limpiar errores cuando el usuario edite un campo
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
      // Formatear fecha de inicio con ordinal
      if (key === "fechaInicioLabores" && value) {
        result = result.replace(regex, formatDateWithOrdinal(value.toString()));
      } else {
        result = result.replace(regex, value);
      }
    });
    return result;
  };

  // Función helper para asegurar compatibilidad de datos
  const getPDFData = () => {
    return {
      ...contractData,
      // Asegurar que todos los campos estén presentes
      nacionalidad: contractData.nacionalidad || "",
      descripcionServicios: contractData.descripcionServicios || "",
      fechaEjecucion:
        contractData.fechaEjecucion ||
        new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    };
  };

  // Validar campos obligatorios
  const validateRequiredFields = () => {
    const errors: string[] = [];

    // Solo validar campos realmente necesarios
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

    // Validar campos obligatorios antes de enviar
    if (!validateRequiredFields()) {
      return;
    }

    setIsLoading(true);
    try {
      // Importar dinámicamente las librerías de PDF
      const { pdf } = await import("@react-pdf/renderer");

      // Usar StatementOfWorkPDF para evitar problemas con React 19
      const pdfData = getPDFData();
      const pdfDocument = <StatementOfWorkPDF data={pdfData} />;

      // Generar el PDF como blob
      const pdfBlob = await pdf(pdfDocument).toBlob();

      // Convertir a base64
      const base64Content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Extraer solo el contenido base64 (sin el prefijo data:application/pdf;base64,)
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(pdfBlob);
      });

      // Datos para el endpoint del backend usando la interfaz definida
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

      // Usar la action para enviar el contrato
      const result = await sendContractToSignWell(
        applicant.lastRelevantPostulacion.id,
        contractPayload
      );

      if (result.success) {
        console.log("Contract sent successfully:", result.data);

        // Show signing URLs and redirect to first signer
        if (result.signingUrls && result.signingUrls.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          result.signingUrls.forEach((signer: any) => {
            console.log(`${signer.name}: ${signer.signingUrl}`);
          });

          // Redirect to first signer URL (candidate)
          const candidateUrl = result.signingUrls.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (signer: any) =>
              signer.name === contractData.nombreCompleto ||
              signer.email === contractData.correoElectronico
          );

          if (candidateUrl?.signingUrl) {
            // Open signing URL for the candidate in a new tab
            window.open(candidateUrl.signingUrl, "_blank");
          }
        }

        // Show success message
        addNotification(
          "Contract sent successfully! The signing window has been opened for the candidate.",
          "success"
        );

        // Send contract notification email
        try {
          const emailResponse = await sendContractSentNotification(
            contractData.nombreCompleto,
            contractData.correoElectronico
          );

          if (emailResponse.success) {
            console.log("✅ Contract notification email sent successfully");
            addNotification(
              "Contract notification email sent to candidate.",
              "success"
            );
          } else {
            console.error(
              "❌ Error sending contract notification email:",
              emailResponse.error
            );
            // Don't show error to user since the main action succeeded
          }
        } catch (emailError) {
          console.error(
            "❌ Error sending contract notification email:",
            emailError
          );
          // Don't show error to user since the main action succeeded
        }

        onClose();
      } else {
        console.error("Error sending contract:", result.message);
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
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden custom-scrollbar">
          {/* Left Side - Templates */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Contract Templates
            </h3>

            <div className="space-y-3">
              {contractTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    handleTemplateChange(template);
                    setSelectedServiceId(template.id);
                    // También actualizar el puesto de trabajo
                    setContractData((prev) => ({
                      ...prev,
                      puestoTrabajo: template.name,
                    }));
                  }}
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
                              type={field.includes("fecha") ? "date" : "text"}
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
                    {contractData && selectedTemplate ? (
                      <PDFPreview
                        selectedTemplate={selectedTemplate}
                        contractData={getPDFData()}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <FileText size={48} className="mx-auto mb-4" />
                          <p>Loading PDF preview...</p>
                        </div>
                      </div>
                    )}
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
