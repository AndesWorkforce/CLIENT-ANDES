"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  Upload,
  Eye,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import SimpleHeader from "../components/SimpleHeader";
import {
  uploadMonthlyProof,
  CurrentContractData,
  MonthlyProof,
  actualizarDocumentosLeidos,
  DocumentoLeido,
  EstadoDocumentosLeidos,
  obtenerDocumentosLeidos,
  actualizarDocumentoEspecifico,
} from "./actions/current-contract.actions";
import { getCurrentContract } from "../pages/offers/actions/jobs.actions";
import { useAuthStore } from "@/store/auth.store";
import {
  PoliticaPrevencionAcoso,
  ContratoServicio,
  AcuerdoConfidencialidad,
  AnexosPoliticaAcoso,
  ManualBuenGobierno,
  RemoteHarassmentPolicyEN,
  GoodGovernanceManualEN,
  AnnexesHarassmentEN,
  ConfidentialityAgreementEN,
  CommunicationsProtocolEN,
} from "./components/DocumentTemplates";
import { useNotificationStore } from "@/store/notifications.store";

export default function CurrentApplication() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [currentJob, setCurrentJob] = useState<CurrentContractData | null>(
    null
  );
  const [monthlyProofs, setMonthlyProofs] = useState<MonthlyProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Estados para el modal de documentos
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [readDocuments, setReadDocuments] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [scrollableContentNode, setScrollableContentNode] =
    useState<HTMLDivElement | null>(null);
  const [endOfContentMarkerNode, setEndOfContentMarkerNode] =
    useState<HTMLDivElement | null>(null);
  const endObserver = useRef<IntersectionObserver | null>(null);

  // Estados para tracking de tiempo de lectura
  const [documentStartTime, setDocumentStartTime] = useState<number>(0);
  const [documentReadingTime, setDocumentReadingTime] = useState<{
    [key: string]: number;
  }>({});
  const [isUpdatingDatabase, setIsUpdatingDatabase] = useState(false);

  // Estado para mostrar/ocultar descripción completa
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Edit/replace proof modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const editingProofRef = useRef<MonthlyProof | null>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Documents that must be read after signing (now 4 items)
  const contractDocuments = [
    {
      id: "annexes_harassment_en",
      name: "Annexes – Policy for the Prevention and Response to Harassment",
      template: "AnnexesHarassmentEN",
      description:
        "Harassment complaint form, response/protection pathway, and support resources (English)",
    },
    {
      id: "good_governance_manual_en",
      name: "Good Governance Manual for Remote Service Contractors (Natural Persons)",
      template: "GoodGovernanceManualEN",
      description:
        "Ethics and conduct guidelines for service contractors (English)",
    },
    {
      id: "remote_harassment_policy_en",
      name: "Policy for the Prevention and Response to Harassment in Remote Work",
      template: "RemoteHarassmentPolicyEN",
      description: "Remote/hybrid work harassment policy (English)",
    },
    {
      id: "communications_protocol_en",
      name: "Communications Protocol: Contracting Company – Independent Service Contractor (Natural Person)",
      template: "CommunicationsProtocolEN",
      description:
        "Guidelines for communication and coordination respecting contractor independence (English)",
    },
  ];

  // Mapeo de nombres de documentos a secciones de la API
  const documentToSection: { [key: string]: string } = {
    annexes_harassment_en: "introduccion",
    good_governance_manual_en: "politicas",
    remote_harassment_policy_en: "beneficios",
    communications_protocol_en: "reglamento",
    // Map communications protocol to reglamento to complete 4 flags
  };

  // Get current date information
  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()]; // Get current month name
  const currentYear = currentDate.getFullYear();

  // Set current month and year when component mounts or when they change
  useEffect(() => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, [currentMonth, currentYear]);

  const currentContract = async () => {
    if (!user?.id) return;
    try {
      const response = await getCurrentContract(user?.id);
      if (response.success && response.data) {
        setCurrentJob(response.data);
        setMonthlyProofs(response.data.monthlyProofs || []);

        // 🚨 CARGAR DOCUMENTOS DIRECTAMENTE DEL PROCESO DE CONTRATACIÓN
        const initialReadState: { [key: string]: boolean } = {
          introduccion: response.data.introduccionLeido || false,
          politicas: response.data.politicasLeido || false,
          beneficios: response.data.beneficiosLeido || false,
          contrato: response.data.contratoLeido || false,
          reglamento: response.data.reglamentoLeido || false,

          // Map documents to their section status
          annexes_harassment_en: response.data.introduccionLeido || false,
          good_governance_manual_en: response.data.politicasLeido || false,
          remote_harassment_policy_en: response.data.beneficiosLeido || false,
          communications_protocol_en: response.data.reglamentoLeido || false,
        };

        const initialReadingTime: { [key: string]: number } = {
          introduccion: 0,
          politicas: 0,
          beneficios: 0,
          contrato: 0,
          reglamento: 0,
        };

        setReadDocuments(initialReadState);
        setDocumentReadingTime(initialReadingTime);
      }
    } catch (error) {
      console.error(
        "[currentApplication] Error fetching current contract:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user?.id) {
      currentContract();
    }
  }, [user]);

  // Efecto para manejar el scroll de documentos
  useEffect(() => {
    setHasReachedEnd(false);

    if (!scrollableContentNode || !endOfContentMarkerNode) {
      return;
    }

    if (endObserver.current) {
      endObserver.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasReachedEnd(true);
        } else {
          setHasReachedEnd(false);
        }
      },
      { root: scrollableContentNode, threshold: 0.1 }
    );

    endObserver.current = observer;
    observer.observe(endOfContentMarkerNode);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [currentDocumentIndex, scrollableContentNode, endOfContentMarkerNode]);

  // Efecto para tracking periódico de tiempo de lectura
  useEffect(() => {
    if (!showDocumentsModal || documentStartTime === 0) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const sessionTime = Math.floor((currentTime - documentStartTime) / 1000);
      const currentDocId = contractDocuments[currentDocumentIndex]?.id;

      if (currentDocId && sessionTime > 0) {
        // Actualizar tiempo acumulado cada 30 segundos
        setDocumentReadingTime((prev) => {
          const newTime = (prev[currentDocId] || 0) + 30;

          // Actualizar en BD cada 2 minutos de lectura
          if (newTime % 120 === 0 && currentJob?.id) {
            actualizarEstadoDocumentosEnDB();
          }

          return {
            ...prev,
            [currentDocId]: newTime,
          };
        });

        // Reiniciar contador de sesión
        setDocumentStartTime(currentTime);
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [
    showDocumentsModal,
    currentDocumentIndex,
    documentStartTime,
    currentJob?.id,
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Upload a completely new proof (from the top form)
  const handleNewProofUpload = async () => {
    if (!selectedFile || !selectedMonth || !currentJob?.id) return;
    setUploading(true);
    try {
      const result = await uploadMonthlyProof(
        currentJob.id,
        selectedMonth,
        selectedYear,
        selectedFile
      );
      if (result.success) {
        const newProof: MonthlyProof = {
          id: result.data?.id || `proof-${Date.now()}`,
          month: selectedMonth,
          year: selectedYear,
          file: result.data?.file || URL.createObjectURL(selectedFile),
          fileName: selectedFile.name,
          uploadDate: new Date().toISOString().split("T")[0],
          status: "PENDING",
        };
        setMonthlyProofs((prev) => [...prev, newProof]);
        setSelectedFile(null);
        setSelectedMonth("");
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        addNotification("File uploaded successfully", "success");
      } else {
        console.error("Error uploading file:", result.error);
        addNotification(result.error || "Error uploading file", "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      addNotification("Error uploading file", "error");
    } finally {
      setUploading(false);
    }
  };

  // Replace an existing proof via modal
  const handleReplaceProof = async () => {
    if (!replacementFile || !editingProofRef.current || !currentJob?.id) return;
    setUploading(true);
    try {
      const proofToEdit = editingProofRef.current;
      const result = await uploadMonthlyProof(
        currentJob.id,
        proofToEdit.month,
        proofToEdit.year,
        replacementFile
      );
      if (result.success) {
        setMonthlyProofs((prev) =>
          prev.map((p) =>
            p.id === proofToEdit.id
              ? {
                  ...p,
                  file: result.data?.file || p.file,
                  fileName: replacementFile.name,
                  status: "PENDING",
                }
              : p
          )
        );
        addNotification("Proof updated successfully", "success");
        setShowEditModal(false);
        setReplacementFile(null);
      } else {
        addNotification(result.error || "Error updating proof", "error");
      }
    } catch (error) {
      console.error("Error updating proof", error);
      addNotification("Error updating proof", "error");
    } finally {
      setUploading(false);
      editingProofRef.current = null;
    }
  };

  // Funciones para el modal de documentos
  const openDocumentsModal = async () => {
    console.log("📖 Opening documents modal...");
    setShowDocumentsModal(true);

    // 🚨 CARGAR DOCUMENTOS DESDE LA BASE DE DATOS AUTOMÁTICAMENTE
    if (currentJob?.id) {
      console.log("🔄 Cargando documentos desde BD...");
      try {
        const response = await obtenerDocumentosLeidos(currentJob.id);
        if (response.success && response.data) {
          const initialReadState: { [key: string]: boolean } = {};
          const initialReadingTime: { [key: string]: number } = {};

          // Solo procesar documentos que existen en el frontend
          const frontendDocIds = contractDocuments.map((doc) => doc.id);

          response.data.forEach((doc) => {
            // Solo cargar documentos que realmente existen en el frontend
            if (frontendDocIds.includes(doc.seccionDocumento)) {
              initialReadState[doc.seccionDocumento] =
                doc.completamenteLeido && doc.terminosAceptados;
              initialReadingTime[doc.seccionDocumento] = doc.tiempoTotalLectura;
            }
          });

          console.log("✅ Documentos cargados desde BD en modal:", {
            filteredDocs: response.data.filter((doc) =>
              frontendDocIds.includes(doc.seccionDocumento)
            ),
            readState: initialReadState,
            readingTime: initialReadingTime,
            frontendDocs: frontendDocIds,
          });

          setReadDocuments(initialReadState);
          setDocumentReadingTime(initialReadingTime);
        }
      } catch (error) {
        console.error("❌ Error cargando documentos:", error);
      }
    }

    // Solo resetear el índice si es la primera vez
    if (Object.keys(readDocuments).length === 0) {
      setCurrentDocumentIndex(0);
    }
    // Inicializar contador de tiempo para el documento actual
    setDocumentStartTime(Date.now());
    document.body.style.overflow = "hidden";
  };

  const closeDocumentsModal = async () => {
    setShowDocumentsModal(false);
    // NO resetear readDocuments - mantener el progreso del usuario
    // setReadDocuments({});
    // setCurrentDocumentIndex(0);

    // Actualizar tiempo final del documento actual si estaba siendo leído
    if (documentStartTime > 0) {
      const currentTime = Date.now();
      const sessionTime = Math.floor((currentTime - documentStartTime) / 1000);
      const currentDocId = contractDocuments[currentDocumentIndex]?.id;

      if (currentDocId && sessionTime > 0) {
        setDocumentReadingTime((prev) => ({
          ...prev,
          [currentDocId]: (prev[currentDocId] || 0) + sessionTime,
        }));
      }
    }

    // Actualizar estado en la base de datos al cerrar
    if (currentJob?.id && Object.keys(readDocuments).length > 0) {
      await actualizarEstadoDocumentosEnDB();
    }

    document.body.style.overflow = "auto";
  };

  const handleDocumentRead = async (documentId: string) => {
    console.log("📖 User marked document as read:", documentId);

    // Calcular tiempo de lectura
    const currentTime = Date.now();
    const readingTime = Math.max(
      0,
      Math.floor((currentTime - documentStartTime) / 1000)
    ); // en segundos

    // Actualizar estado local
    const newReadState = {
      ...readDocuments,
      [documentId]: true,
    };
    setReadDocuments(newReadState);

    // Actualizar tiempo de lectura
    const newReadingTime = {
      ...documentReadingTime,
      [documentId]: (documentReadingTime[documentId] || 0) + readingTime,
    };
    setDocumentReadingTime(newReadingTime);

    // Actualizar en la base de datos
    if (currentJob?.id && user?.id) {
      const currentDoc = contractDocuments[currentDocumentIndex];
      if (currentDoc) {
        try {
          const section = documentToSection[currentDoc.id];
          if (!section) {
            console.error("Sección no válida:", currentDoc.id);
            return;
          }

          const result = await actualizarDocumentoEspecifico(
            currentJob.id,
            section,
            {
              completamenteLeido: true,
              terminosAceptados: true,
            }
          );

          if (result.success) {
            console.log("✅ Documento actualizado:", result.data);
            // Actualizar el currentJob para reflejar los cambios
            const updatedContract = await getCurrentContract(user.id);
            if (updatedContract.success && updatedContract.data) {
              setCurrentJob(updatedContract.data);
            }
          } else {
            console.error("❌ Error actualizando documento:", result.error);
          }
        } catch (error) {
          console.error("❌ Error actualizando documento:", error);
        }
      }
    }
  };

  const handleNextDocument = async () => {
    console.log("🔄 handleNextDocument iniciado", {
      currentDocumentIndex,
      totalDocuments: contractDocuments.length,
      currentDoc: contractDocuments[currentDocumentIndex],
      currentJobId: currentJob?.id,
      userId: user?.id,
    });

    if (currentDocumentIndex < contractDocuments.length - 1) {
      // Actualizar el documento actual en la base de datos
      const currentDoc = contractDocuments[currentDocumentIndex];
      if (currentDoc && currentJob?.id && user?.id) {
        try {
          const section = documentToSection[currentDoc.id];
          console.log("📝 Intentando actualizar documento", {
            documentId: currentDoc.id,
            section,
            procesoId: currentJob.id,
          });

          if (!section) {
            console.error("❌ Sección no válida:", currentDoc.id);
            return;
          }

          const result = await actualizarDocumentoEspecifico(
            currentJob.id,
            section,
            {
              completamenteLeido: true,
              terminosAceptados: true,
            }
          );

          console.log("✅ Resultado de actualización:", result);

          if (result.success) {
            setCurrentDocumentIndex((prev) => prev + 1);
            setHasReachedEnd(false);
            // Reiniciar contador de tiempo para el siguiente documento
            setDocumentStartTime(Date.now());
            // Actualizar el currentJob para reflejar los cambios
            const updatedContract = await getCurrentContract(user.id);
            if (updatedContract.success && updatedContract.data) {
              setCurrentJob(updatedContract.data);
              console.log("✅ Contract actualizado:", updatedContract.data);
            }
          } else {
            console.error("❌ Error actualizando documento:", result.error);
            addNotification(
              "Error updating document: " + result.error,
              "error"
            );
          }
        } catch (error) {
          console.error("❌ Error en handleNextDocument:", error);
          addNotification("Error updating document", "error");
        }
      }
    } else {
      // Actualizar estado final en la base de datos
      if (currentJob?.id && user?.id) {
        const currentDoc = contractDocuments[currentDocumentIndex];
        if (currentDoc) {
          try {
            const section = documentToSection[currentDoc.id];
            if (!section) {
              console.error("Sección no válida:", currentDoc.id);
              return;
            }

            const result = await actualizarDocumentoEspecifico(
              currentJob.id,
              section,
              {
                completamenteLeido: true,
                terminosAceptados: true,
              }
            );

            if (result.success) {
              addNotification(
                "Congratulations! You have read all the documents. We are now waiting for the provider's final signature to complete the hiring process.",
                "success"
              );
              closeDocumentsModal();
              // Actualizar el currentJob para reflejar los cambios
              const updatedContract = await getCurrentContract(user.id);
              if (updatedContract.success && updatedContract.data) {
                setCurrentJob(updatedContract.data);
              }
            } else {
              console.error(
                "❌ Error actualizando documento final:",
                result.error
              );
            }
          } catch (error) {
            console.error("Error al actualizar el documento final:", error);
          }
        }
      }
    }
  };

  // Función para verificar si todos los documentos han sido leídos
  const allDocumentsRead = () => {
    return contractDocuments.every((doc) => readDocuments[doc.id] === true);
  };

  // Función para actualizar estado de documentos en la base de datos
  const actualizarEstadoDocumentosEnDB = async (
    todoCompletado: boolean = false
  ) => {
    if (!currentJob?.id || isUpdatingDatabase) return;

    setIsUpdatingDatabase(true);

    try {
      // Preparar datos para enviar al backend
      const documentos: DocumentoLeido[] = contractDocuments.map((doc) => ({
        seccionDocumento: doc.id,
        porcentajeLeido: readDocuments[doc.id] ? 100 : 0,
        tiempoLectura: documentReadingTime[doc.id] || 0,
        completamenteLeido: readDocuments[doc.id] || false,
        terminosAceptados: readDocuments[doc.id] || false,
      }));

      const estadoDocumentos: EstadoDocumentosLeidos = {
        documentos,
        todoCompletado: todoCompletado || allDocumentsRead(),
      };

      console.log("💾 Updating documents in DB:", estadoDocumentos);

      const result = await actualizarDocumentosLeidos(
        currentJob.id,
        estadoDocumentos
      );

      if (result.success) {
        console.log("✅ Documents updated in DB:", result.data);

        // Si se completó todo, actualizar el estado local del job
        if (result.data?.estadoContratacion) {
          setCurrentJob((prev) =>
            prev
              ? {
                  ...prev,
                  estadoContratacion: result.data!.estadoContratacion,
                }
              : null
          );

          // If all documents completed, show success message
          if (result.data.todoCompletado) {
            console.log(
              "🎉 All documents completed! Waiting for provider signature..."
            );
          }
        }
      } else {
        console.error("❌ Error updating documents:", result.error);
        // No mostrar error al usuario para no interrumpir la experiencia
      }
    } catch (error) {
      console.error("❌ Error in actualizarEstadoDocumentosEnDB:", error);
    } finally {
      setIsUpdatingDatabase(false);
    }
  };

  // Función para renderizar el template del documento
  const renderDocumentTemplate = (templateName: string) => {
    const candidateName = currentJob?.nombreCompleto || "Candidate";
    const companyName =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentJob as any)?.propuesta?.empresa?.nombre || "Andes Consulting";
    const position =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentJob as any)?.propuesta?.titulo || "Cargo no especificado";
    const startDate =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentJob as any)?.fechaInicio || new Date().toLocaleDateString();

    const templateProps = {
      candidateName,
      companyName,
      position,
      startDate,
    };

    switch (templateName) {
      case "PoliticaPrevencionAcoso":
        return <PoliticaPrevencionAcoso {...templateProps} />;
      case "ContratoServicio":
        return <ContratoServicio {...templateProps} />;
      case "AcuerdoConfidencialidad":
        return <AcuerdoConfidencialidad {...templateProps} />;
      case "AnexosPoliticaAcoso":
        return <AnexosPoliticaAcoso {...templateProps} />;
      case "ManualBuenGobierno":
        return <ManualBuenGobierno {...templateProps} />;
      case "AnnexesHarassmentEN":
        return <AnnexesHarassmentEN {...templateProps} />;
      case "GoodGovernanceManualEN":
        return <GoodGovernanceManualEN {...templateProps} />;
      case "RemoteHarassmentPolicyEN":
        return <RemoteHarassmentPolicyEN {...templateProps} />;
      case "ConfidentialityAgreementEN":
        return <ConfidentialityAgreementEN {...templateProps} />;
      case "CommunicationsProtocolEN":
        return <CommunicationsProtocolEN {...templateProps} />;
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              Template {templateName} no encontrado.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Por favor contacta al administrador del sistema.
            </p>
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
            <AlertCircle size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case "SIGNED":
        return (
          <span className="px-3 py-1 text-green-800 text-sm rounded-full flex items-center gap-1">
            <CheckCircle size={14} />
            Signed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 text-yellow-800 text-sm rounded-full flex items-center gap-1">
            <Clock size={14} />
            Pending Signature
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 text-red-800 text-sm rounded-full flex items-center gap-1">
            <X size={14} />
            Rejected
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-3 py-1 text-gray-800 text-sm rounded-full flex items-center gap-1">
            <AlertCircle size={14} />
            Expired
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-gray-800 text-sm rounded-full flex items-center gap-1">
            <AlertCircle size={14} />
            Unknown
          </span>
        );
    }
  };

  // Auto-open documents modal if candidate signed but needs to read documents
  useEffect(() => {
    console.log("🔍 DEBUG - useEffect triggered:", {
      currentJob: !!currentJob,
      estadoContratacion: currentJob?.estadoContratacion,
      shouldOpenModal:
        currentJob &&
        (currentJob.estadoContratacion === "FIRMADO_CANDIDATO" ||
          currentJob.estadoContratacion === "DOCUMENTOS_EN_LECTURA"),
    });

    if (
      currentJob &&
      (currentJob.estadoContratacion === "FIRMADO_CANDIDATO" ||
        currentJob.estadoContratacion === "DOCUMENTOS_EN_LECTURA")
    ) {
      console.log("🚀 Opening documents modal automatically!");
      openDocumentsModal();
    }
  }, [currentJob]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097B2] mx-auto" />
          <p className="mt-4 text-gray-600">Loading service information...</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No current service information found</p>
        </div>
      </div>
    );
  }

  // Show pending contract notification if contract is not fully signed by both parties
  const isContractFullySigned =
    currentJob.estadoContratacion === "CONTRATO_FINALIZADO";

  const needsDocumentReading =
    (currentJob.estadoContratacion === "FIRMADO_CANDIDATO" ||
      currentJob.estadoContratacion === "DOCUMENTOS_EN_LECTURA") &&
    !allDocumentsRead();

  const isWaitingForProviderSignature =
    currentJob.estadoContratacion === "DOCUMENTOS_COMPLETADOS" ||
    currentJob.estadoContratacion === "PENDIENTE_FIRMA_PROVEEDOR";

  console.log("🔍 Calculated states:", {
    showDocumentsModal,
    estadoContratacion: currentJob?.estadoContratacion,
    isContractFullySigned,
    needsDocumentReading,
    isWaitingForProviderSignature,
    allDocumentsRead: allDocumentsRead(),
  });

  const validContractStatuses = [
    "PENDING",
    "SIGNED",
    "REJECTED",
    "EXPIRED",
  ] as const;
  const displayContractStatus = validContractStatuses.includes(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentJob.contractStatus as any
  )
    ? currentJob.contractStatus
    : isContractFullySigned
    ? "SIGNED"
    : "PENDING";

  if (!isContractFullySigned) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <SimpleHeader title="Current Application" />
        <div className="max-w-6xl mx-auto">
          {/* Contract Pending Notification */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#0097B2] text-white p-6">
              <h1 className="text-2xl font-bold">Contract Status</h1>
              <p className="text-blue-100 mt-1">
                Your service contract information
              </p>
            </div>

            <div className="p-8">
              <div className="text-center">
                <div className="mb-6">
                  {currentJob.estadoContratacion ===
                    "PENDIENTE_FIRMA_CANDIDATO" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <Clock
                        size={48}
                        className="text-yellow-600 mx-auto mb-4"
                      />
                      <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                        Contract Signature Pending
                      </h2>
                      <p className="text-yellow-700 mb-4">
                        Your service contract is ready for signature. Please
                        sign the contract to access your service dashboard and
                        benefits.
                      </p>

                      {/* Botón para firmar si hay URL disponible */}
                      {currentJob.signWellUrlCandidato && (
                        <div className="mt-4">
                          <a
                            href={currentJob.signWellUrlCandidato}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0097B2] text-white font-medium rounded-lg hover:bg-[#007B8E] transition-colors"
                          >
                            <FileText size={20} />
                            Sign Contract Now
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Estado: Necesita leer documentos */}
                  {needsDocumentReading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <AlertCircle
                        size={48}
                        className="text-red-600 mx-auto mb-4"
                      />
                      <h2 className="text-xl font-semibold text-red-800 mb-2">
                        ⚠️ Action Required: Read Contract Documents
                      </h2>
                      <p className="text-red-700 mb-4">
                        {currentJob.estadoContratacion ===
                        "DOCUMENTOS_EN_LECTURA"
                          ? "You have started the document reading process. You must complete reading all documents to finalize the hiring process."
                          : "You have successfully signed the contract. Now you must read and accept all additional documents to complete the hiring process."}
                      </p>
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                        <p className="text-sm text-red-800">
                          Progress:{" "}
                          {
                            contractDocuments.filter(
                              (doc) => readDocuments[doc.id]
                            ).length
                          }{" "}
                          of {contractDocuments.length} documents read
                        </p>
                      </div>
                      <button
                        onClick={openDocumentsModal}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors animate-pulse"
                      >
                        <FileText size={20} />
                        Read Documents Now
                      </button>
                    </div>
                  )}

                  {/* Estado: Esperando firma del proveedor */}
                  {isWaitingForProviderSignature && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <CheckCircle
                        size={48}
                        className="text-blue-600 mx-auto mb-4"
                      />
                      <h2 className="text-xl font-semibold text-blue-800 mb-2">
                        ✅ Documents Completed
                      </h2>
                      <p className="text-blue-700 mb-4">
                        Excellent! You have read and accepted all contract
                        documents. We are now waiting for the provider&apos;s
                        final signature to complete the process.
                      </p>
                      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Status:</strong> Waiting for provider/company
                          signature
                        </p>
                        <p className="text-sm text-blue-800 mt-1">
                          <strong>Documents read:</strong>{" "}
                          {contractDocuments.length}/{contractDocuments.length}{" "}
                          ✅
                        </p>
                      </div>
                      {/* <div className="flex gap-4 justify-center">
                        <button
                          onClick={openDocumentsModal}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye size={16} />
                          Review Documents
                        </button>
                      </div> */}
                    </div>
                  )}

                  {currentJob.contractStatus === "REJECTED" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <X size={48} className="text-red-600 mx-auto mb-4" />
                      <h2 className="text-xl font-semibold text-red-800 mb-2">
                        Contract Rejected
                      </h2>
                      <p className="text-red-700 mb-4">
                        The service contract was rejected. Please contact HR for
                        more information.
                      </p>
                      {getContractStatusBadge(displayContractStatus)}
                    </div>
                  )}

                  {currentJob.contractStatus === "EXPIRED" && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <AlertCircle
                        size={48}
                        className="text-gray-600 mx-auto mb-4"
                      />
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Contract Expired
                      </h2>
                      <p className="text-gray-700 mb-4">
                        The service contract has expired. Please contact HR to
                        generate a new contract.
                      </p>
                      {getContractStatusBadge(displayContractStatus)}
                    </div>
                  )}
                </div>

                {/* Basic job information - limited view */}
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Position Information
                  </h3>
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Job Position
                      </label>
                      <p className="text-gray-900 font-medium">
                        {currentJob.jobPosition}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Company
                      </label>
                      <p className="text-gray-900">{currentJob.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Proposed Start Date
                      </label>
                      <p className="text-gray-900">
                        {new Date(currentJob.startDate).toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-8">
                  <p className="text-gray-600 text-sm">
                    Need help? Contact our HR team at{" "}
                    <a
                      href="mailto:hr@andes-workforce.com"
                      className="text-[#0097B2] hover:underline"
                    >
                      hr@andes-workforce.com
                    </a>
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Documentos Contractuales */}
        {showDocumentsModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border-2 border-[#0097B2]">
              <div className="flex justify-between items-center p-4 border-b border-[#0097B2]">
                <h2 className="text-xl font-medium text-[#0097B2]">
                  Contract Documents
                </h2>
                <button
                  onClick={closeDocumentsModal}
                  className="text-gray-500 hover:text-[#0097B2] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Please read each of the following documents carefully. You
                    must confirm that you have read each document before
                    proceeding to the next one.
                  </p>

                  {/* Renderizar solo el documento actual */}
                  {contractDocuments[currentDocumentIndex] && (
                    <div
                      key={contractDocuments[currentDocumentIndex].id}
                      className="border-2 border-[#0097B2] rounded-lg overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 border-b border-[#0097B2] flex justify-between items-center">
                        <h3 className="text-lg font-medium text-[#0097B2]">
                          {contractDocuments[currentDocumentIndex].name}
                        </h3>
                        <ChevronDown className="text-[#0097B2]" size={20} />
                      </div>

                      <div
                        ref={setScrollableContentNode}
                        className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
                      >
                        <div className="prose max-w-none mb-4">
                          {/* Renderizar el template del documento actual */}
                          {renderDocumentTemplate(
                            contractDocuments[currentDocumentIndex].template
                          )}
                          <div
                            ref={setEndOfContentMarkerNode}
                            className="h-5"
                          />
                        </div>
                      </div>

                      <div className="p-4 border-t border-[#0097B2] bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`readConfirmation-${contractDocuments[currentDocumentIndex].id}`}
                              checked={
                                readDocuments[
                                  contractDocuments[currentDocumentIndex].id
                                ] || false
                              }
                              onChange={() => {
                                const docId =
                                  contractDocuments[currentDocumentIndex].id;
                                handleDocumentRead(docId);
                              }}
                              className="mr-2 accent-[#0097B2]"
                            />
                            <label
                              htmlFor={`readConfirmation-${contractDocuments[currentDocumentIndex].id}`}
                              className="text-sm text-gray-600"
                            >
                              I confirm that I have read and understood this
                              document
                            </label>
                          </div>
                          <button
                            onClick={handleNextDocument}
                            disabled={
                              !readDocuments[
                                contractDocuments[currentDocumentIndex].id
                              ] || !hasReachedEnd
                            }
                            className={`px-4 py-2 rounded ${
                              readDocuments[
                                contractDocuments[currentDocumentIndex].id
                              ] && hasReachedEnd
                                ? "bg-[#0097B2] text-white hover:bg-[#007B8F]"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {currentDocumentIndex < contractDocuments.length - 1
                              ? "Next Document"
                              : "Complete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit proof modal */}
        {showEditModal && editingProofRef.current && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium text-gray-800">
                  Edit Proof
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 p-6">
                {/* Upload form for editing */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setReplacementFile(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  />
                </div>

                {/* Preview and confirm */}
                {replacementFile && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Preview
                    </h3>
                    <iframe
                      src={URL.createObjectURL(replacementFile)}
                      className="w-full h-[300px] border border-gray-200 rounded-lg"
                      title="Proof Preview"
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      if (replacementFile) {
                        handleReplaceProof();
                      }
                    }}
                    disabled={!replacementFile || uploading}
                    className="px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full view for signed contracts
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SimpleHeader title="Current Application" />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Pending Annexes Notification */}
        {currentJob.pendingAnnexes && currentJob.pendingAnnexes.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Clock size={24} className="text-yellow-600 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                  Pending Documents
                </h2>
                <p className="text-yellow-700 mb-4">
                  You have {currentJob.pendingAnnexes.length} pending
                  document(s) to sign.
                </p>
                <div className="space-y-3">
                  {currentJob.pendingAnnexes.map((annex) => (
                    <div
                      key={annex.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-yellow-100"
                    >
                      <span className="font-medium text-gray-700">
                        {annex.title}
                      </span>
                      <a
                        href={annex.signUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0097B2] text-white text-sm font-medium rounded hover:bg-[#007B8E] transition-colors"
                      >
                        <FileText size={16} />
                        Sign Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Employment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#0097B2] text-white p-6">
            <h1 className="text-2xl font-bold">Current Contract</h1>
            <p className="text-blue-100 mt-1">
              Job position information and documentation
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Position Data */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Position Details
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Job Position
                    </label>
                    <p className="text-gray-900 font-medium">
                      {currentJob.jobPosition}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Company
                    </label>
                    <p className="text-gray-900">{currentJob.company}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Start Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(currentJob.startDate).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Salary
                    </label>
                    <p className="text-gray-900 font-medium">
                      {currentJob.ofertaSalarial
                        ? `$${currentJob.ofertaSalarial.toLocaleString()}`
                        : "N/A"}{" "}
                      {currentJob.monedaSalario}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contract Status
                    </label>
                    <div className="mt-1">
                      {getContractStatusBadge(displayContractStatus)}
                    </div>
                  </div>
                </div>

                {currentJob.jobDescription && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-500">
                        Job Description
                      </label>
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="flex items-center gap-1 text-[#0097B2] hover:text-[#007B8E] text-sm font-medium transition-colors"
                      >
                        <Eye size={14} />
                        {showFullDescription ? "Hide" : "View Full"}
                      </button>
                    </div>

                    {showFullDescription ? (
                      <div
                        className="text-gray-700 prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border"
                        dangerouslySetInnerHTML={{
                          __html: currentJob.jobDescription,
                        }}
                      />
                    ) : (
                      <div className="text-gray-700 text-sm">
                        <div
                          className="line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html:
                              currentJob.jobDescription.length > 150
                                ? currentJob.jobDescription.substring(0, 150) +
                                  "..."
                                : currentJob.jobDescription,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Documentation and Instructions */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Documentation
                </h2>

                {currentJob.contratoFinalUrl && (
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="text-[#0097B2]" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">
                              Active Contract
                            </p>
                            <p className="text-sm text-gray-500">
                              Signed document
                            </p>
                          </div>
                        </div>
                        <a
                          href={currentJob.contratoFinalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>

                    {/* Signed Annexes */}
                    {currentJob.signedAnnexes &&
                      currentJob.signedAnnexes.length > 0 &&
                      currentJob.signedAnnexes.map((annex) => (
                        <div
                          key={annex.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="text-[#0097B2]" size={20} />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {annex.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Signed on{" "}
                                  {new Date(annex.signedAt).toLocaleDateString(
                                    "en-US"
                                  )}
                                </p>
                              </div>
                            </div>
                            <a
                              href={annex.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors"
                            >
                              <Eye size={16} />
                              View
                            </a>
                          </div>
                        </div>
                      ))}

                    {/* Active Breaks Guide */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="text-[#0097B2]" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">
                              Active Breaks Guide
                            </p>
                            <p className="text-sm text-gray-500">
                              Learn about active breaks and their importance
                            </p>
                          </div>
                        </div>
                        <a
                          href="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/PAUSAS_ACTIVAS_VF_.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors"
                        >
                          <Eye size={16} />
                          View Guide
                        </a>
                      </div>
                    </div>

                    {/* Botón para leer documentos adicionales */}
                    {(currentJob.contractStatus === "SIGNED" ||
                      currentJob.estadoContratacion ===
                        "FIRMADO_CANDIDATO") && (
                      <div
                        className={`border rounded-lg p-4 ${
                          currentJob.estadoContratacion === "FIRMADO_CANDIDATO"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <AlertCircle
                              className={
                                currentJob.estadoContratacion ===
                                  "FIRMADO_CANDIDATO" && !allDocumentsRead()
                                  ? "text-red-600"
                                  : allDocumentsRead()
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }
                              size={20}
                            />
                            <div>
                              <p
                                className={`font-medium ${
                                  currentJob.estadoContratacion ===
                                    "FIRMADO_CANDIDATO" && !allDocumentsRead()
                                    ? "text-red-900"
                                    : allDocumentsRead()
                                    ? "text-green-900"
                                    : "text-yellow-900"
                                }`}
                              >
                                {allDocumentsRead()
                                  ? "✅ Documents Completed"
                                  : currentJob.estadoContratacion ===
                                    "FIRMADO_CANDIDATO"
                                  ? "⚠️ Action Required: Read Contract Documents"
                                  : "📄 Additional Contract Documents"}
                              </p>
                              <p
                                className={`text-sm ${
                                  currentJob.estadoContratacion ===
                                    "FIRMADO_CANDIDATO" && !allDocumentsRead()
                                    ? "text-red-700"
                                    : allDocumentsRead()
                                    ? "text-green-700"
                                    : "text-yellow-700"
                                }`}
                              >
                                {allDocumentsRead()
                                  ? "You have read all required documents"
                                  : currentJob.estadoContratacion ===
                                    "FIRMADO_CANDIDATO"
                                  ? "You must read all contract documents to complete the hiring process"
                                  : "Please read all contract documents to complete the process"}
                              </p>
                              {!allDocumentsRead() && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Progress:{" "}
                                  {
                                    contractDocuments.filter(
                                      (doc) => readDocuments[doc.id]
                                    ).length
                                  }{" "}
                                  of {contractDocuments.length} documents read
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentJob.instructions &&
                  currentJob.instructions.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Important Instructions
                      </h3>
                      <ul className="space-y-2">
                        {currentJob.instructions.map(
                          (instruction: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#0097B2] rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700 text-sm">
                                {instruction}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Proofs Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Proofs
            </h2>
            <p className="text-gray-600 mt-1">
              Upload your monthly proofs to enable payment processing
            </p>
          </div>

          <div className="p-6">
            {/* Upload Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload New Proof
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    value={currentMonth}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={currentYear}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Selected file:</strong> {selectedFile.name}
                  </p>
                </div>
              )}

              <button
                onClick={handleNewProofUpload}
                disabled={!selectedFile || !selectedMonth || uploading}
                className="flex items-center gap-2 px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Proof
                  </>
                )}
              </button>
            </div>

            {/* Proofs List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Uploaded Proofs
              </h3>

              {monthlyProofs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No proofs uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monthlyProofs.map((proof) => (
                    <div
                      key={proof.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-[#0097B2]" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {proof.month} {proof.year}
                              </p>
                              <p className="text-sm text-gray-500">
                                Uploaded on{" "}
                                {new Date(proof.uploadDate).toLocaleDateString(
                                  "en-US"
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="ml-4">
                            {getStatusBadge(proof.status)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(proof.file, "_blank")}
                            className="flex items-center gap-2 px-3 py-2 text-[#0097B2] border border-[#0097B2] rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => {
                              editingProofRef.current = proof;
                              setShowEditModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            <Upload size={16} />
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <strong>File:</strong> {proof.fileName}
                      </div>

                      {/* Observaciones de la revisión */}
                      {proof.observacionesRevision && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle
                              size={16}
                              className="text-yellow-600 mt-0.5"
                            />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">
                                Observations:
                              </p>
                              <p className="text-sm text-yellow-700 mt-1">
                                {proof.observacionesRevision}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Documentos Contractuales */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border-2 border-[#0097B2]">
            <div className="flex justify-between items-center p-4 border-b border-[#0097B2]">
              <h2 className="text-xl font-medium text-[#0097B2]">
                Contract Documents
              </h2>
              <button
                onClick={closeDocumentsModal}
                className="text-gray-500 hover:text-[#0097B2] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Please read each of the following documents carefully. You
                  must confirm that you have read each document before
                  proceeding to the next one.
                </p>

                {/* Renderizar solo el documento actual */}
                {contractDocuments[currentDocumentIndex] && (
                  <div
                    key={contractDocuments[currentDocumentIndex].id}
                    className="border-2 border-[#0097B2] rounded-lg overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 border-b border-[#0097B2] flex justify-between items-center">
                      <h3 className="text-lg font-medium text-[#0097B2]">
                        {contractDocuments[currentDocumentIndex].name}
                      </h3>
                      <ChevronDown className="text-[#0097B2]" size={20} />
                    </div>

                    <div
                      ref={setScrollableContentNode}
                      className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
                    >
                      <div className="prose max-w-none mb-4">
                        {/* Renderizar el template del documento actual */}
                        {renderDocumentTemplate(
                          contractDocuments[currentDocumentIndex].template
                        )}
                        <div ref={setEndOfContentMarkerNode} className="h-5" />
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#0097B2] bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`readConfirmation-${contractDocuments[currentDocumentIndex].id}`}
                            checked={
                              readDocuments[
                                contractDocuments[currentDocumentIndex].id
                              ] || false
                            }
                            onChange={() => {
                              const docId =
                                contractDocuments[currentDocumentIndex].id;
                              handleDocumentRead(docId);
                            }}
                            className="mr-2 accent-[#0097B2]"
                          />
                          <label
                            htmlFor={`readConfirmation-${contractDocuments[currentDocumentIndex].id}`}
                            className="text-sm text-gray-600"
                          >
                            I confirm that I have read and understood this
                            document
                          </label>
                        </div>
                        <button
                          onClick={handleNextDocument}
                          disabled={
                            !readDocuments[
                              contractDocuments[currentDocumentIndex].id
                            ] || !hasReachedEnd
                          }
                          className={`px-4 py-2 rounded ${
                            readDocuments[
                              contractDocuments[currentDocumentIndex].id
                            ] && hasReachedEnd
                              ? "bg-[#0097B2] text-white hover:bg-[#007B8F]"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {currentDocumentIndex < contractDocuments.length - 1
                            ? "Next Document"
                            : "Complete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit proof modal */}
      {showEditModal && editingProofRef.current && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Edit Proof</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-6">
              {/* Upload form for editing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReplacementFile(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                />
              </div>

              {/* Preview and confirm */}
              {replacementFile && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Preview
                  </h3>
                  <iframe
                    src={URL.createObjectURL(replacementFile)}
                    className="w-full h-[300px] border border-gray-200 rounded-lg"
                    title="Proof Preview"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (replacementFile) {
                      handleReplaceProof();
                    }
                  }}
                  disabled={!replacementFile || uploading}
                  className="px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
