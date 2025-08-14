"use client";

import React, { useState, useEffect, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { FileText, AlertCircle, Loader2 } from "lucide-react";

// Importar todos los templates de PDF dinámicamente
import StatementOfWorkEnglishPDF from "./templates/StatementOfWorkEnglishPDF";
import AdmisionesContractPDF from "./templates/AdmisionesContractPDF";
import LlamadaBienvenidaContractPDF from "./templates/LlamadaBienvenidaContractPDF";
import AdministracionCasosContractPDF from "./templates/AdministracionCasosContractPDF";
import EntradaDatosContractPDF from "./templates/EntradaDatosContractPDF";
import CustomContractPDF from "./templates/CustomContractPDF";

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  variables: string[];
  component: string;
  category: string;
}

interface ContractData {
  nombreCompleto: string;
  correoElectronico: string;
  cedula: string;
  telefono: string;
  direccionCompleta: string;
  nacionalidad: string;
  puestoTrabajo: string;
  descripcionServicios: string;
  ofertaSalarial: string;
  salarioProbatorio: string;
  monedaSalario: string;
  fechaInicioLabores: string;
  fechaEjecucion: string;
  nombreBanco: string;
  numeroCuenta: string;
}

interface PDFPreviewSSGProps {
  selectedTemplate: ContractTemplate | null;
  contractData: ContractData;
  pdfUrl?: string | null;
}

const PDFPreviewSSG: React.FC<PDFPreviewSSGProps> = ({
  selectedTemplate,
  contractData,
  pdfUrl,
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(pdfUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Para forzar re-render cuando cambie el template

  // Función para obtener el componente PDF correcto
  const getPDFComponent = useCallback(
    (template: ContractTemplate, data: ContractData) => {
      try {
        // Limpiar datos para evitar errores
        const safeData = {
          ...data,
          nombreCompleto: data.nombreCompleto || "Nombre Completo",
          correoElectronico: data.correoElectronico || "email@example.com",
          cedula: data.cedula || "000000000",
          telefono: data.telefono || "000-000-0000",
          nacionalidad: data.nacionalidad || "Sin especificar",
          direccionCompleta:
            data.direccionCompleta || "Dirección no especificada",
          puestoTrabajo: data.puestoTrabajo || "Posición",
          descripcionServicios:
            data.descripcionServicios || "Servicios profesionales",
          ofertaSalarial: data.ofertaSalarial || "0",
          salarioProbatorio: data.salarioProbatorio || "0",
          monedaSalario: data.monedaSalario || "USD",
          nombreBanco: data.nombreBanco || "Banco",
          numeroCuenta: data.numeroCuenta || "000000000",
          fechaEjecucion:
            data.fechaEjecucion ||
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          fechaInicioLabores:
            data.fechaInicioLabores || new Date().toISOString().split("T")[0],
        };

        // Seleccionar el componente correcto basado en el template
        switch (template.id) {
          case "english-contract":
            return <StatementOfWorkEnglishPDF data={safeData} />;

          case "admisiones":
            return <AdmisionesContractPDF data={safeData} />;

          case "llamadas-bienvenida":
            return <LlamadaBienvenidaContractPDF data={safeData} />;

          case "administracion-casos":
            return <AdministracionCasosContractPDF data={safeData} />;

          case "entrada-datos":
            return <EntradaDatosContractPDF data={safeData} />;

          case "custom":
            return <CustomContractPDF data={safeData} />;

          default:
            // Para todos los demás casos, usar StatementOfWorkPDF
            return <StatementOfWorkEnglishPDF data={safeData} />;
        }
      } catch (error) {
        console.error("Error creating PDF component:", error);
        // Fallback a StatementOfWorkPDF si hay error
        return <StatementOfWorkEnglishPDF data={data} />;
      }
    },
    []
  );

  // Función para generar el PDF
  const generatePDF = useCallback(
    async (template: ContractTemplate, data: ContractData) => {
      if (!template || !data) return;

      setIsGenerating(true);
      setError(null);

      try {
        // Crear el componente PDF
        const pdfComponent = getPDFComponent(template, data);

        // Generar el PDF blob
        const pdfBlob = await pdf(pdfComponent).toBlob();

        // Limpiar URL anterior si existe
        if (pdfBlobUrl && pdfBlobUrl !== pdfUrl) {
          URL.revokeObjectURL(pdfBlobUrl);
        }

        // Crear nueva URL para el blob
        const newBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(newBlobUrl);
      } catch (err) {
        console.error("Error generating PDF:", err);
        setError(
          "Error al generar el PDF. Por favor, verifica los datos del contrato."
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [getPDFComponent, pdfBlobUrl, pdfUrl]
  );

  // Efecto para regenerar PDF cuando cambien el template o los datos
  useEffect(() => {
    if (selectedTemplate && contractData) {
      // Incrementar key para forzar re-render
      setKey((prev) => prev + 1);
      generatePDF(selectedTemplate, contractData);
    }
  }, [selectedTemplate?.id, contractData, generatePDF]);

  // Limpiar URLs al desmontar el componente
  useEffect(() => {
    return () => {
      if (pdfBlobUrl && pdfBlobUrl !== pdfUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl, pdfUrl]);

  // Estados de renderizado
  if (isGenerating) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0097B2]" />
          <p className="text-gray-600">
            Generando vista previa del contrato...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedTemplate?.name || "Cargando template..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error al generar PDF
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() =>
              selectedTemplate && generatePDF(selectedTemplate, contractData)
            }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            Selecciona un template para ver la vista previa
          </p>
        </div>
      </div>
    );
  }

  if (!pdfBlobUrl) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-8 w-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Preparando vista previa...</p>
        </div>
      </div>
    );
  }

  // Renderizar el PDF en un iframe
  return (
    <div key={key} className="h-full w-full">
      <iframe
        src={pdfBlobUrl}
        className="w-full h-full border-0 rounded-lg"
        title={`Vista previa - ${selectedTemplate.name}`}
        style={{ minHeight: "500px" }}
      />
    </div>
  );
};

export default PDFPreviewSSG;
