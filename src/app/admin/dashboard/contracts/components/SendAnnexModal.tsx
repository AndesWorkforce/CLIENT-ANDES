"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, FileText, Send, Eye } from "lucide-react";
import StatementOfWorkPDF from "../../postulants/components/templates/StatementOfWorkPDF";
import StatementOfWorkEnglishPDF from "../../postulants/components/templates/StatementOfWorkEnglishPDF";
import NewStatementOfWorkEnglishPDF from "../../postulants/components/templates/NewStatementOfWorkEnglishPDF";
import ComplianceDeclarationAnnexPDF from "../../postulants/components/templates/ComplianceDeclarationAnnexPDF";
import LoanAgreementAnnexPDF from "../../postulants/components/templates/LoanAgreementAnnexPDF";
import ExtensionAddendumAnnexPDF from "../../postulants/components/templates/ExtensionAddendumAnnexPDF";
import {
  ProfessionalServicesAgreementColPDF,
  IndependentContractorAgreementUsaPDF,
  InternationalProfessionalServicesAgreementPDF,
  ContractTemplate,
} from "../../postulants/components/templates";
import { ProcesoContratacion } from "../interfaces/contracts.interface";
import { useNotificationStore } from "@/store/notifications.store";
import { DocumentProps } from "@react-pdf/renderer";
import {
  filesUploadPdfWithKey,
  esignCreateDocument,
  esignAddRecipients,
  esignAddFields,
  esignSendDocument,
  esignUpdateDocumentSource,
} from "@/app/admin/dashboard/actions/esign.client";

interface SendAnnexModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ProcesoContratacion;
  onAnnexSent?: () => void;
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
    // PSA Colombia
    montoEnLetrasUSD: "Amount in words (USD)",
    // USA ICA
    cityCountry: "City, Country",
    // Service Fee (New English Template)
    fixedFee: "Fixed fee",
    fixedHours: "Fixed hours",
    example1Hours: "1st hour example",
    example1Fee: "1st fee example",
    example2Hours: "2nd hour example",
    example2Fee: "2nd fee example",
    example3Hours: "3rd hour example",
    example3Fee: "3rd fee example",
    // Loan Agreement
    laptopModel: "Laptop Brand/Model",
    serialNumber: "Serial Number",
    // Extension Addendum
    paisDocumento: "Country of Issue",
    fechaInicioContratoOriginal: "Original Contract Date",
    montoUltimoPago: "Last Payment Amount",
    fechaInicioExtension: "Extension Start Date",
    fechaFinExtension: "Extension End Date",
    nuevoValorContrato: "New Contract Value",
    signContractDate: "Sign Contract Date",
  };

  const requiredFields = [
    "nombreCompleto",
    "correoElectronico",
    "cedula",
    "telefono",
    "direccionCompleta",
    "nacionalidad",
    "laptopModel",
    "serialNumber",
    "paisDocumento",
    "fechaInicioContratoOriginal",
    "montoUltimoPago",
    "fechaInicioExtension",
    "fechaFinExtension",
    "nuevoValorContrato",
    "signContractDate",
  ];
  const label = labels[field] || field.charAt(0).toUpperCase() + field.slice(1);

  return requiredFields.includes(field) ? `${label} *` : label;
};

const getFieldPlaceholder = (field: string): string => {
  const placeholders: Record<string, string> = {
    nombreCompleto: "e.g., Ana Yarely Chávez",
    correoElectronico: "e.g., ana.chavez@email.com",
    laptopModel: "e.g., Dell Latitude 5420",
    serialNumber: "e.g., 8H2K9L1",
    cedula: "e.g., 12345678901",
    paisDocumento: "e.g., Colombia",
    fechaInicioContratoOriginal: "e.g., January 1, 2024",
    montoUltimoPago: "e.g., 1000",
    fechaInicioExtension: "e.g., May 1, 2024",
    fechaFinExtension: "e.g., August 31, 2024",
    nuevoValorContrato: "e.g., 1200",
    signContractDate: "e.g., June 30, 2025",
    telefono: "e.g., +1 (555) 123-4567",
    direccionCompleta: "e.g., 123 Main St, City, State, ZIP",
    nacionalidad: "e.g., Colombian, American, etc.",
    puestoTrabajo: "e.g., Administrative Assistant",
    descripcionServicios: "Detailed description of responsibilities...",
    ofertaSalarial: "1100",
    salarioProbatorio: "1000",
    monedaSalario: "USD",
    // Service Fee placeholders
    fixedFee: "300",
    fixedHours: "30",
    example1Hours: "24",
    example1Fee: "300",
    example2Hours: "30",
    example2Fee: "300",
    example3Hours: "35",
    example3Fee: "350",
    // PSA Colombia
    montoEnLetrasUSD: "One thousand one hundred",
    // USA ICA
    cityCountry: "e.g., Miami, USA",
  };
  return placeholders[field] || `Enter ${field}`;
};

// Componente separado para el preview del PDF
const PDFPreview: React.FC<{
  selectedTemplate: ContractTemplate;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contractData: any;
}> = ({ selectedTemplate, contractData }) => {
  const [pdfKey, setPdfKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [renderErr, setRenderErr] = useState<string | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  const requiredFields: string[] = selectedTemplate?.variables || [];
  const missingFields = requiredFields.filter(
    (field: string) =>
      contractData[field] === undefined ||
      contractData[field] === null ||
      contractData[field] === ""
  );

  const pdfDocument = useMemo<React.ReactElement<DocumentProps>>(() => {
    try {
      if (selectedTemplate.id === "english-contract") {
        return <StatementOfWorkEnglishPDF data={contractData} />;
      }
      if (selectedTemplate.id === "new-english-contract") {
        return <NewStatementOfWorkEnglishPDF data={contractData} />;
      }
      if (selectedTemplate.id === "psa-col-english") {
        return <ProfessionalServicesAgreementColPDF data={contractData} />;
      }
      if (selectedTemplate.id === "psa-international-english") {
        return (
          <InternationalProfessionalServicesAgreementPDF data={contractData} />
        );
      }
      if (selectedTemplate.id === "ica-usa-english") {
        return <IndependentContractorAgreementUsaPDF data={contractData} />;
      }
      if (selectedTemplate.id === "compliance-declaration") {
        return <ComplianceDeclarationAnnexPDF data={contractData} />;
      }
      if (selectedTemplate.id === "loan-agreement") {
        return <LoanAgreementAnnexPDF data={contractData} />;
      }
      if (selectedTemplate.id === "extension-addendum") {
        return <ExtensionAddendumAnnexPDF data={contractData} />;
      }
      return <StatementOfWorkPDF data={contractData} />;
    } catch (e) {
      console.error("Error creating PDF document element:", e);
      return <StatementOfWorkPDF data={contractData} />;
    }
  }, [selectedTemplate.id, contractData]);

  useEffect(() => {
    setIsLoading(true);
    setShowPDF(false);
    const timer = setTimeout(() => {
      setPdfKey((prev) => prev + 1);
      setIsLoading(false);
      setShowPDF(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedTemplate.id, contractData]);

  useEffect(() => {
    let cancelled = false;
    let revokeUrl: string | null = null;
    setRenderErr(null);
    setBlobUrl(null);
    const run = async () => {
      try {
        if (!showPDF || isLoading || missingFields.length > 0) return;
        const { pdf } = await import("@react-pdf/renderer");
        await new Promise((r) => setTimeout(r, 60));
        const blob = await pdf(pdfDocument).toBlob();
        if (cancelled) return;
        revokeUrl = URL.createObjectURL(blob);
        setBlobUrl(revokeUrl);
      } catch (e) {
        console.error("PDF render error:", e);
        if (!cancelled) setRenderErr("Unable to render preview");
      }
    };
    run();
    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [pdfKey, showPDF, isLoading, missingFields.length, pdfDocument]);

  if (isLoading || !showPDF) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097B2] mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading PDF preview...</p>
        </div>
      </div>
    );
  }

  if (missingFields.length > 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Faltan datos para el anexo:
          </p>
          <ul className="text-xs text-red-500 mb-2">
            {missingFields.map((field: string) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-400">
            Completa todos los campos requeridos para ver el PDF.
          </p>
        </div>
      </div>
    );
  }

  if (renderErr) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">{renderErr}</p>
          <p className="text-xs text-gray-400">
            Try editing the content or reopen the modal.
          </p>
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097B2] mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Rendering PDF…</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      key={pdfKey}
      src={blobUrl}
      title="Contract Preview"
      style={{ width: "100%", height: "100%", border: 0 }}
    />
  );
};

export default function SendAnnexModal({
  isOpen,
  onClose,
  contract,
  onAnnexSent,
}: SendAnnexModalProps) {
  const { addNotification } = useNotificationStore();

  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const sendingRef = useRef(false);
  const PSA_COL_DEFAULT_SERVICES =
    "maintaining client files, answering phone calls, speaking with potential and current clients, processing legal documents, initiating claims and appeals, providing case-related information, uploading PDFs to electronic portals, gathering potential client information for review, processing admission documents and entering data digitally, confirming client medical appointments, assisting with required forms, and performing additional tasks as assigned";

  const contractTemplates = useMemo((): ContractTemplate[] => {
    const workingTemplates: ContractTemplate[] = [];

    // Annex: Compliance Declaration
    workingTemplates.push({
      id: "compliance-declaration",
      name: "ANNEX - COMPLIANCE DECLARATION",
      description:
        "Declaration of compliance with Andes Workforce policies (Equipment, Personal Devices, Secure Location, Confidentiality). Requires only Contractor signature.",
      subject: "Annex - Compliance Declaration - {{nombreCompleto}}",
      component: "ComplianceDeclarationAnnexPDF",
      category: "Compliance",
      variables: ["nombreCompleto", "correoElectronico"],
    });

    // Annex: Loan Agreement
    workingTemplates.push({
      id: "loan-agreement",
      name: "ANNEX I – LOAN AGREEMENT",
      description:
        "Loan agreement for laptop computer. Requires only Contractor signature.",
      subject: "Annex - Loan Agreement - {{nombreCompleto}}",
      component: "LoanAgreementAnnexPDF",
      category: "Equipment",
      variables: [
        "nombreCompleto",
        "correoElectronico",
        "telefono",
        "direccionCompleta",
        "laptopModel",
        "serialNumber",
      ],
    });

    // Annex: Extension Addendum
    workingTemplates.push({
      id: "extension-addendum",
      name: "ADDENDUM FOR EXTENSION",
      description:"Description of the services to be provided",
      subject: "Addendum for Extension - {{nombreCompleto}}",
      component: "ExtensionAddendumAnnexPDF",
      category: "Contract Amendment",
      variables: [
        "nombreCompleto",
        "correoElectronico",
        "cedula",
        "paisDocumento",
        "fechaInicioContratoOriginal",
        "nuevoValorContrato",
        "descripcionServicios",
      "signContractDate",
      ],
    });

    return workingTemplates;
  }, []);

  const [contractData, setContractData] = useState(() => ({
    // Datos básicos del empleado
    nombreCompleto: contract.nombreCompleto || "CANDIDATE NAME",
    correoElectronico:
      contract.correo ||
      (contract as any).emailCandidato ||
      "email@example.com", // Ensure email is available
    cedula: "123456789",
    telefono: contract.telefono ?? "+57 300 123 4567",
    nacionalidad: "Colombian",
    direccionCompleta: contract.residencia ?? "Calle 123 # 45-67, Bogota",
    cityCountry: "Bogota, Colombia",
    laptopModel: "Dell Latitude 5420",
    serialNumber: "SN-PENDING",

    // Extension Addendum Data
    paisDocumento: "Colombia",
    fechaInicioContratoOriginal: "January 1, 2024",
    montoUltimoPago: contract.ofertaSalarial?.toString() || "1000",
    fechaInicioExtension: "May 1, 2024",
    fechaFinExtension: "August 31, 2024",
    nuevoValorContrato: contract.ofertaSalarial?.toString() || "1200",
    signContractDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),

    // Datos del puesto
    puestoTrabajo: contract.puestoTrabajo || "Administrative Assistant",
    descripcionServicios:
      "Serves as the first point of contact for new or prospective clients. Responsible for gathering initial case information, verifying basic eligibility, and entering client details into internal systems.",

    // Datos salariales
    ofertaSalarial: contract.ofertaSalarial?.toString() || "1100",
    salarioProbatorio: "1000",
    monedaSalario: contract.monedaSalario || "USD",
    montoEnLetrasUSD: "One thousand one hundred",

    fixedFee: "300",
    fixedHours: "30",
    example1Hours: "24",
    example1Fee: "300",
    example2Hours: "30",
    example2Fee: "300",
    example3Hours: "35",
    example3Fee: "350",

    serviceFeeParagraph: `As of the Start Date, Contractor will be paid a fee of USD 1000 fixed per month during a 3-month probationary period. Starting the first day of the month following the probationary period, Contractor will be paid a fee of USD 1100 fixed per month, inclusive of all taxes (howsoever described) (“Service Fee”). Payment of the Service Fee to Contractor will be initiated on the last day of the month. This Service Fee will be increased by 5% annually. Contractors will receive extra pay when required to work during a local holiday according to their country of residence regulation.\n\nAdditionally, Contractor will receive a 2-week holiday bonus at the end of each calendar year. The holiday bonus will be prorated for Contractors who have completed less than 6 months of work at the end of the calendar year.`,

    fechaInicioLabores: (() => {
      const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    })(),
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
      setContractData((prev) => ({
        ...prev,
        descripcionServicios: contractTemplates[0].description,
      }));
    }
  }, [isOpen]);

  const handleTemplateChange = (template: ContractTemplate) => {
    setShowPreview(false);
    setTimeout(() => {
      setSelectedTemplate(template);
      setContractData((prev) => ({
        ...prev,
        descripcionServicios:
          template.id === "psa-col-english" ||
          template.id === "psa-international-english"
            ? PSA_COL_DEFAULT_SERVICES
            : template.description,
      }));
      setPreviewKey((k) => k + 1);
      setShowPreview(true);
    }, 350);
  };

  const handleInputChange = (key: string, value: string) => {
    setContractData((prev) => ({ ...prev, [key]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
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

  const getPDFData = () => {
    return {
      ...contractData,
      nombreCompleto: contractData.nombreCompleto || "Contractor Name",
      correoElectronico:
        contractData.correoElectronico || "contractor@email.com",
      cedula: contractData.cedula || "000000000",
      telefono: contractData.telefono || "000-000-0000",
      nacionalidad: contractData.nacionalidad || "Unknown",
      direccionCompleta:
        contractData.direccionCompleta || "Address not provided",
      laptopModel: contractData.laptopModel || "",
      serialNumber: contractData.serialNumber || "",
      puestoTrabajo: contractData.puestoTrabajo || "Professional Services",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cityCountry: (contractData as any).cityCountry || "City, Country",
      descripcionServicios:
        contractData.descripcionServicios ||
        "Professional services to be provided",
      serviceFeeParagraph:
        (contractData as any).serviceFeeParagraph !== undefined &&
        (contractData as any).serviceFeeParagraph !== null
          ? String((contractData as any).serviceFeeParagraph)
          : undefined,
      ofertaSalarial: contractData.ofertaSalarial || "0",
      salarioProbatorio: contractData.salarioProbatorio || "0",
      monedaSalario: contractData.monedaSalario || "USD",
      fechaEjecucion:
        contractData.fechaEjecucion ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      fechaInicioLabores:
        contractData.fechaInicioLabores ||
        (() => {
          const d = new Date();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const yyyy = d.getFullYear();
          return `${mm}/${dd}/${yyyy}`;
        })(),
      psaClauseOne:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (contractData as any).psaClauseOne &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        String((contractData as any).psaClauseOne).trim().length > 0
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            String((contractData as any).psaClauseOne)
          : contractData.descripcionServicios || "",
    };
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

  const handleSendAnnex = async () => {
    if (sendingRef.current) return; // prevent double send
    if (!selectedTemplate) return;
    if (!validateRequiredFields()) return;

    sendingRef.current = true;
    setIsLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const pdfData = getPDFData();
      let pdfDocument;

      if (!pdfData || !pdfData.nombreCompleto) {
        throw new Error("Missing required contract data");
      }

      try {
        if (selectedTemplate.id === "english-contract") {
          pdfDocument = <StatementOfWorkEnglishPDF data={pdfData} />;
        } else if (selectedTemplate.id === "compliance-declaration") {
          pdfDocument = <ComplianceDeclarationAnnexPDF data={pdfData} />;
        } else if (selectedTemplate.id === "loan-agreement") {
          pdfDocument = <LoanAgreementAnnexPDF data={pdfData} />;
        } else if (selectedTemplate.id === "extension-addendum") {
          pdfDocument = <ExtensionAddendumAnnexPDF data={pdfData} />;
        } else {
          pdfDocument = <StatementOfWorkPDF data={pdfData} />;
        }
      } catch (error) {
        console.error("Error creating PDF document:", error);
        throw error;
      }

      const pdfBlob = await pdf(pdfDocument).toBlob();

      // Use template subject with variables replaced for ESIGN document title
      const tituloDoc = replaceVariables(selectedTemplate.subject);
      const createData = await esignCreateDocument({
        titulo: tituloDoc,
        descripcion: `${selectedTemplate.name} · ${selectedTemplate.category}`,
        procesoContratacionId: contract.id,
        isAnnex: true,
      });
      const documentId = createData.document?.id;
      if (!documentId) {
        addNotification("Invalid document response.", "error");
        return;
      }

      const fixedKey = `documents/esign/${documentId}.pdf`;
      const publicUrl = await filesUploadPdfWithKey(pdfBlob, fixedKey);
      await esignUpdateDocumentSource(documentId, publicUrl);

      // Determine recipients: all annexes are single-signer (Contractor only)
      const recipientsList = [
        {
          email: contractData.correoElectronico,
          nombre: contractData.nombreCompleto,
          orden: 1,
          rol: "CANDIDATO",
        },
      ];

      const recipientsPayload = {
        recipients: recipientsList,
      };
      const docWithRecipients = await esignAddRecipients(
        documentId,
        recipientsPayload
      );
      const candidateRecipient = docWithRecipients.recipients.find(
        (r: any) => r.rol === "CANDIDATO"
      );

      if (candidateRecipient) {
        const fields = [] as any[];

        // Place signature at the bottom of the LAST page to avoid
        // overlapping body text across annex templates.
        // Coordinates are normalized [0..1] from top to bottom.
        // We anchor the signature box at ~82% of the page height.
        const baseY = 0.82;
        // Left margin alignment for single contractor signer
        const candidateX = 0.12;

        // Candidate Signature box
        fields.push({
          pageNumber: -1,
          x: candidateX,
          y: baseY,
          width: 0.3,
          height: 0.08,
          fieldType: "SIGNATURE",
          assignedToRecipientId: candidateRecipient.id,
          required: true,
          label: "Candidate Signature",
        });
        // Dynamic signer details captured at signing time
        // Place Name / Country / Identification No. below the signature box
        fields.push({
          pageNumber: -1,
          x: candidateX,
          // Name just below the signature box with tighter spacing
          y: Math.min(baseY + 0.085, 0.91),
          width: 0.33,
          height: 0.03,
          fieldType: "TEXT",
          assignedToRecipientId: candidateRecipient.id,
          required: true,
          label: "Name",
        });
        fields.push({
          pageNumber: -1,
          x: candidateX,
          // Country slightly below Name (reduced gap)
          y: Math.min(baseY + 0.105, 0.935),
          width: 0.33,
          height: 0.03,
          fieldType: "TEXT",
          assignedToRecipientId: candidateRecipient.id,
          required: true,
          label: "Country",
        });
        fields.push({
          pageNumber: -1,
          x: candidateX,
          // ID just below Country (reduced gap)
          y: Math.min(baseY + 0.125, 0.96),
          width: 0.33,
          height: 0.03,
          fieldType: "TEXT",
          assignedToRecipientId: candidateRecipient.id,
          required: true,
          label: "Identification No.",
        });

        const fieldsPayload = { fields };
        await esignAddFields(documentId, fieldsPayload);
      }

      await esignSendDocument(documentId);

      addNotification("Annex sent successfully to recipients.", "success");
      if (onAnnexSent) onAnnexSent();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      addNotification(
        "An unexpected error occurred while sending the annex.",
        "error"
      );
    } finally {
      setIsLoading(false);
      sendingRef.current = false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Send Annex to {contract.nombreCompleto}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden custom-scrollbar">
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Annex Templates
            </h3>

            <div className="space-y-3">
              {contractTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    handleTemplateChange(template);
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
                  <p className="text-sm text-gray-600 mt-1">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">Annex Data</h4>
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
                      "direccionCompleta",
                      "laptopModel",
                      "serialNumber",
                      "paisDocumento",
                      "fechaInicioContratoOriginal",
                      "nuevoValorContrato",
                      "descripcionServicios",
                      "signContractDate",
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
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Preview</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Eye size={16} className="mr-1" />
                Annex preview
              </div>
            </div>

            {selectedTemplate && showPreview ? (
              <div
                key={previewKey}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6"
              >
                <div className="mb-6 pb-4 border-b border-[#0097B2]">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Subject:
                  </h4>
                  <p className="text-lg font-semibold text-gray-800">
                    {replaceVariables(selectedTemplate.subject)}
                  </p>
                </div>
                <div className="bg-white rounded border shadow-sm">
                  <div className="h-[600px] border rounded-lg overflow-hidden">
                    <PDFPreview
                      selectedTemplate={selectedTemplate}
                      contractData={getPDFData()}
                    />
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

        <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
          <p className="text-sm text-gray-500 italic">
            This document requires only the Contractor&apos;s signature. No
            Company signer needed.
          </p>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
          <div className="text-xs text-gray-400">
            Review the data before sending.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendAnnex}
              disabled={!selectedTemplate || isLoading}
              className="px-6 py-2 rounded-md bg-gradient-to-r from-[#0097B2] to-[#00b8d8] text-white shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Annex
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatDateWithOrdinal = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  const suffix =
    day > 3 && day < 21
      ? "th"
      : (["st", "nd", "rd"] as const)[((day % 10) - 1) as number] || "th";
  return `${month} ${day}${suffix}, ${year}`;
};
