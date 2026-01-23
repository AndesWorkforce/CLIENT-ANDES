"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  HelpCircle,
  Info,
} from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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
import {
  getActiveContractsForUser,
  getUserContractById,
} from "./actions/current-contract.actions";
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
import {
  getUserInboxesAction,
  viewInboxPdfAction,
  downloadInboxPdfAction,
  generateUserInboxAction,
} from "./actions/invoices.actions";

export default function CurrentApplication() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const u: any = user;
  const isColombiaUser = (() => {
    const country = String(
      u?.country ?? u?.pais ?? u?.location?.country ?? u?.address?.country ?? ""
    )
      .trim()
      .toLowerCase();
    return country === "colombia";
  })();
  const [currentJob, setCurrentJob] = useState<CurrentContractData | null>(
    null
  );
  const [monthlyProofs, setMonthlyProofs] = useState<MonthlyProof[]>([]);
  const [availableContracts, setAvailableContracts] = useState<
    Pick<CurrentContractData, "id" | "company" | "jobPosition" | "startDate">[]
  >([]);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<{
    month: string;
    year: number;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"proofs" | "inboxes">(
    "proofs"
  );
  // Skeleton state for smoother contract switching UX
  const [isSwitchingContract, setIsSwitchingContract] = useState(false);
  // Set initial tab based on user's country (Colombia -> proofs, others -> inboxes)
  useEffect(() => {
    setSelectedTab(isColombiaUser ? "proofs" : "inboxes");
  }, [isColombiaUser]);
  type InboxItem = {
    id: string;
    invoiceNumber: string;
    month: string;
    year: number;
    amount: number;
    currency: string;
    generatedAt: string; // ISO date
    status: "PAID" | "PENDING";
    viewUrl?: string;
    downloadUrl?: string;
  };
  const [inboxes, setInboxes] = useState<InboxItem[]>([]);
  const [genMonth, setGenMonth] = useState<string>("");
  const [genYear, setGenYear] = useState<number>(new Date().getFullYear());
  const [visibleInboxCount, setVisibleInboxCount] = useState(6);
  const [inboxScrollNode, setInboxScrollNode] = useState<HTMLDivElement | null>(
    null
  );
  const [inboxEndSentinelNode, setInboxEndSentinelNode] =
    useState<HTMLDivElement | null>(null);
  const inboxObserver = useRef<IntersectionObserver | null>(null);

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

  const startTour = () => {
    try {
      const d = driver({
        showProgress: true,
        overlayOpacity: 0.35,
        steps: [
          {
            element: "#documents-section",
            popover: {
              title: "Documents",
              description:
                "Manage your monthly proofs and payment inboxes here.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#period-input",
            popover: {
              title: "Period",
              description:
                "Pick the period. It includes allowed months this year and the Dec 2025 exception.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#file-upload-trigger",
            popover: {
              title: "Select the file",
              description:
                "Click to choose the file. Images (JPG/PNG) or PDF are accepted.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#upload-proof-button",
            popover: {
              title: "Upload your proof",
              description:
                "When everything is ready, press here to upload and save your monthly proof.",
              side: "top",
              align: "start",
            },
          },
        ],
      });
      d.drive();
    } catch (e) {
      console.error("Error starting tour", e);
    }
  };

  const startInboxesTour = () => {
    try {
      const steps: any[] = [];
      if (document.getElementById("inboxes-generate-section")) {
        steps.push({
          element: "#inboxes-generate-section",
          popover: {
            title: "Generate Invoice",
            description:
              "Select the month (current year only) and click Generate to create your invoice/inbox.",
            side: "bottom",
            align: "start",
          },
        });
      }
      if (document.getElementById("inboxes-generate-month")) {
        steps.push({
          element: "#inboxes-generate-month",
          popover: {
            title: "Month",
            description:
              "You can generate for any past month in the current year.",
            side: "bottom",
            align: "start",
          },
        });
      }
      if (document.getElementById("inboxes-generate-button")) {
        steps.push({
          element: "#inboxes-generate-button",
          popover: {
            title: "Create",
            description:
              "Press to create your inbox. In Colombia, you must upload your monthly proof first.",
            side: "left",
            align: "start",
          },
        });
      }
      if (document.getElementById("inboxes-list")) {
        steps.push({
          element: "#inboxes-list",
          popover: {
            title: "Your Invoices",
            description:
              "Use View to open the PDF or Download to save it. More items load as you scroll.",
            side: "top",
            align: "start",
          },
        });
      }
      const d = driver({ showProgress: true, overlayOpacity: 0.35, steps });
      d.drive();
    } catch (e) {
      console.error("Error starting inboxes tour", e);
    }
  };
  console.log("[CURRENT CONTRACT]", currentJob);
  const [showTopHelpNudge, setShowTopHelpNudge] = useState(false);
  const startTopTour = () => {
    try {
      const steps: any[] = [];
      if (document.getElementById("top-card")) {
        steps.push({
          element: "#top-card",
          popover: {
            title: "Current Contract",
            description:
              "Overview of your position details and key documentation.",
            side: "bottom",
            align: "start",
          },
        });
      }
      if (document.getElementById("position-details")) {
        steps.push({
          element: "#position-details",
          popover: {
            title: "Position Details",
            description:
              "Job, company, start date, salary, and contract status.",
            side: "right",
            align: "start",
          },
        });
      }
      if (document.getElementById("active-contract-card")) {
        steps.push({
          element: "#active-contract-card",
          popover: {
            title: "Active Contract",
            description: "Download your signed contract here.",
            side: "left",
            align: "start",
          },
        });
      }
      if (document.getElementById("active-breaks-card")) {
        steps.push({
          element: "#active-breaks-card",
          popover: {
            title: "Active Breaks Guide",
            description: "View the guide with recommendations.",
            side: "left",
            align: "start",
          },
        });
      }
      if (document.getElementById("documents-section")) {
        steps.push({
          element: "#documents-section",
          popover: {
            title: "Documents",
            description:
              "Manage monthly proofs (Colombia) and your payment inboxes.",
            side: "top",
            align: "start",
          },
        });
      }
      const d = driver({ showProgress: true, overlayOpacity: 0.35, steps });
      d.drive();
    } catch (e) {
      console.error("Error starting top tour", e);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    const fullySigned =
      currentJob?.estadoContratacion === "CONTRATO_FINALIZADO";
    if (!fullySigned) return;
    try {
      const key = "currentApp_topTourSeen";
      const seen = typeof window !== "undefined" && localStorage.getItem(key);
      if (!seen) {
        setShowTopHelpNudge(true);
        setTimeout(() => {
          startTopTour();
          try {
            localStorage.setItem(key, "1");
          } catch {}
          setShowTopHelpNudge(false);
          addNotification(
            "Tip: Click the ? icons anytime for a guided tour.",
            "info"
          );
        }, 1000);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [isLoading, currentJob?.estadoContratacion]);

  // Get current date information
  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()]; // Get current month name
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = months.indexOf(currentMonth);
  const allowedMonths = months.slice(0, currentMonthIndex + 1);
  // Build combined period options for Proofs (adds Dec 2025 exception in 2026)
  const periodOptions = useMemo(() => {
    const opts: {
      label: string;
      month: string;
      year: number;
      value: string;
    }[] = [];
    if (selectedTab === "proofs" && currentYear === 2026) {
      opts.push({
        label: "December 2025",
        month: "December",
        year: 2025,
        value: "2025-12",
      });
    }
    allowedMonths.forEach((m, idx) => {
      opts.push({
        label: `${m} ${currentYear}`,
        month: m,
        year: currentYear,
        value: `${currentYear}-${String(idx + 1).padStart(2, "0")}`,
      });
    });
    return opts;
  }, [selectedTab, currentYear, allowedMonths]);
  const showProofsTab = isColombiaUser;
  const showInboxesTab = true;

  // Load real inbox items for the logged-in user (paginated)
  const [inboxNextCursor, setInboxNextCursor] = useState<string | null>(null);
  const [loadingInboxes, setLoadingInboxes] = useState<boolean>(false);

  const mapInboxItems = (items: any[]): InboxItem[] => {
    return (items || [])
      .filter((it) => it.id && typeof it.id === "string" && it.id.trim() !== "")
      .map((it) => {
        const ym: string = String(it.añoMes || "");
        const [yearStr, monthStr] = ym.split("-");
        const mIdx = Math.max(0, Math.min(11, Number(monthStr || 1) - 1));
        const rawStatus = String(
          (it.status || it.estado || it.paymentStatus || "").toString()
        ).toUpperCase();
        const normalizedStatus: "PAID" | "PENDING" =
          rawStatus === "PAID"
            ? "PAID"
            : rawStatus === "PENDING"
            ? "PENDING"
            : isColombiaUser
            ? "PENDING"
            : "PAID"; // Default: non-Colombia invoices are considered Paid
        return {
          id: it.id,
          invoiceNumber: String(it.invoiceNumber || "#"),
          month: months[mIdx],
          year: Number(yearStr || new Date().getFullYear()),
          amount: Number(it.amount || currentJob?.ofertaSalarial || 0),
          currency: String(it.currency || currentJob?.monedaSalario || "USD"),
          generatedAt: String(
            it.createdAt || it.fechaCreacion || new Date().toISOString()
          ),
          status: normalizedStatus,
          viewUrl: undefined,
          downloadUrl: undefined,
        } as InboxItem;
      });
  };

  const handleGenerateInbox = async () => {
    if (!user?.id) return;
    const mIdx = months.indexOf(genMonth || currentMonth);
    if (genYear !== currentYear) {
      addNotification("Year must be the current year", "error");
      return;
    }
    if (mIdx < 0) {
      addNotification("Invalid month selected", "error");
      return;
    }
    if (mIdx > currentMonthIndex) {
      addNotification("Cannot generate an inbox for a future month", "error");
      return;
    }
    const yearMonth = `${genYear}-${String(mIdx + 1).padStart(2, "0")}`;
    try {
      const res = await generateUserInboxAction(
        user.id,
        yearMonth,
        selectedContractId || undefined
      );
      if (!res.success) {
        addNotification(res.error || "Error generating inbox", "error");
        return;
      }
      const item = res.data?.data || res.data;
      if (item) {
        const mapped = mapInboxItems([item])[0];
        setInboxes((prev) => {
          const exists = prev.some(
            (p) => p.year === mapped.year && p.month === mapped.month
          );
          const next = exists ? prev : [mapped, ...prev];
          return next.sort((a, b) =>
            `${b.year}-${String(months.indexOf(b.month) + 1).padStart(
              2,
              "0"
            )}`.localeCompare(
              `${a.year}-${String(months.indexOf(a.month) + 1).padStart(
                2,
                "0"
              )}`
            )
          );
        });
      } else {
        await fetchInboxesPage(false);
      }
      addNotification(
        res.data?.alreadyExists
          ? "Invoice already exists for that month"
          : "Invoice generated",
        res.data?.alreadyExists ? "info" : "success"
      );
    } catch (e) {
      console.error("Error generating inbox", e);
      addNotification("Error generating inbox", "error");
    }
  };

  const fetchInboxesPage = async (append = false) => {
    if (!user?.id) return;
    setLoadingInboxes(true);
    try {
      const res = await getUserInboxesAction(
        user.id,
        append ? inboxNextCursor || undefined : undefined,
        20
      );
      if (!res.success) {
        addNotification(res.error || "Error loading inboxes", "error");
        return;
      }
      const payload = res.data || {};
      const items = mapInboxItems(payload.data || payload.items || []);
      const nextCursor = payload.nextCursor || null;
      setInboxNextCursor(nextCursor);
      setInboxes((prev) => (append ? [...prev, ...items] : items));
      setVisibleInboxCount((prev) =>
        Math.min(append ? prev : 6, append ? prev + items.length : items.length)
      );
    } catch (error) {
      console.error("Error fetching inboxes:", error);
      addNotification("Error loading inboxes", "error");
    } finally {
      setLoadingInboxes(false);
    }
  };

  useEffect(() => {
    if (!currentJob || !user?.id) return;
    if (selectedTab === "inboxes") fetchInboxesPage(false);
  }, [currentJob, user?.id, selectedTab]);

  const loadMoreInboxes = async () => {
    if (visibleInboxCount < inboxes.length) {
      setVisibleInboxCount((prev) => Math.min(prev + 6, inboxes.length));
      return;
    }
    if (inboxNextCursor && !loadingInboxes) {
      await fetchInboxesPage(true);
    }
  };

  // Infinite scroll sentinel for inboxes
  useEffect(() => {
    if (selectedTab !== "inboxes") return;
    if (!inboxScrollNode || !inboxEndSentinelNode) return;

    if (inboxObserver.current) inboxObserver.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMoreInboxes();
        }
      },
      { root: inboxScrollNode, threshold: 0.1 }
    );

    inboxObserver.current = observer;
    observer.observe(inboxEndSentinelNode);

    return () => observer.disconnect();
  }, [selectedTab, inboxScrollNode, inboxEndSentinelNode, inboxes.length]);

  // Set current month and year when component mounts or when they change
  useEffect(() => {
    setSelectedMonth(currentMonth);
    setSelectedPeriod({ month: currentMonth, year: currentYear });
    setGenMonth(currentMonth);
    setGenYear(currentYear);
  }, [currentMonth, currentYear]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false || !user) {
      try {
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, user, router]);

  const currentContract = async () => {
    if (!user?.id) return;
    try {
      const response = await getCurrentContract(user?.id);
      if (response.success && response.data) {
        setCurrentJob(response.data);
        setMonthlyProofs(response.data.monthlyProofs || []);
        setSelectedContractId(response.data.id);

        // Fetch all active contracts to enable selector (non-blocking)
        const listRes = await getActiveContractsForUser(user.id);
        if (listRes.success && listRes.data) {
          const items = (listRes.data || []).map((c) => ({
            id: c.id,
            company: c.company,
            jobPosition: c.jobPosition,
            startDate: c.startDate,
          }));
          setAvailableContracts(items);
        }

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

  // Handle change of selected contract
  const handleSelectContract = async (contractId: string) => {
    if (!user?.id || !contractId || contractId === selectedContractId) return;
    setIsSwitchingContract(true);
    try {
      const res = await getUserContractById(user.id, contractId);
      if (res.success && res.data) {
        setCurrentJob(res.data);
        setMonthlyProofs(res.data.monthlyProofs || []);
        setSelectedContractId(contractId);
        // Reset inbox list state
        setInboxes([]);
        setVisibleInboxCount(6);
        setInboxNextCursor(null);
        // Keep selected tab, refetch inboxes if on inboxes tab
        if (selectedTab === "inboxes") {
          await fetchInboxesPage(false);
        }
      }
    } finally {
      setIsSwitchingContract(false);
    }
  };

  // Skeleton component to display during contract switching
  const SkeletonCurrentContract = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <SimpleHeader title="Current Contract" />
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#0097B2] p-4">
            <div className="h-5 w-48 bg-white/30 rounded animate-pulse" />
            <div className="h-3 w-64 bg-white/20 rounded mt-2 animate-pulse" />
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="h-9 w-full lg:w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-72 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-28 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border border-gray-300 rounded">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
    if (!selectedFile || !selectedPeriod || !currentJob?.id) return;
    const { month: effMonth, year: effYear } = selectedPeriod;
    const selIdx = months.indexOf(effMonth);
    if (selIdx < 0) {
      addNotification("Invalid month selected", "error");
      return;
    }
    const isDec2025 =
      selectedTab === "proofs" && effMonth === "December" && effYear === 2025;
    // Only allow past/current months in current year, or exactly Dec 2025
    const selectedYm = effYear * 100 + (selIdx + 1);
    const currentYm = currentYear * 100 + (currentMonthIndex + 1);
    if (effYear < currentYear && !isDec2025) {
      addNotification("Year cannot be less than the current year", "error");
      return;
    }
    if (effYear > currentYear) {
      addNotification("Year cannot be greater than the current year", "error");
      return;
    }
    if (selectedYm > currentYm) {
      addNotification("You cannot upload a proof for a future month", "error");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadMonthlyProof(
        currentJob.id,
        effMonth,
        effYear,
        selectedFile
      );
      if (result.success) {
        const newProof: MonthlyProof = {
          id: result.data?.id || `proof-${Date.now()}`,
          month: effMonth,
          year: effYear,
          file: result.data?.file || URL.createObjectURL(selectedFile),
          fileName: selectedFile.name,
          uploadDate: new Date().toISOString().split("T")[0],
          status: "PENDING",
        };
        setMonthlyProofs((prev) => [...prev, newProof]);
        setSelectedFile(null);
        setSelectedMonth(currentMonth);
        setSelectedPeriod({ month: currentMonth, year: currentYear });
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
        <style jsx global>{`
          .driver-popover-title {
            color: #0097b2;
          }
          .driver-popover {
            border-color: #0097b2;
          }
          .driver-popover-progress {
            color: #0097b2;
          }
          .driver-popover-close-btn,
          .driver-popover-next-btn,
          .driver-popover-prev-btn {
            cursor: pointer;
          }
          .driver-popover-next-btn,
          .driver-popover-prev-btn {
            background-color: #0097b2;
            color: #fff;
            border-color: #0097b2;
          }
          .driver-popover-footer .driver-popover-close-btn {
            background-color: #0097b2;
            color: #fff;
            border-color: #0097b2;
          }
        `}</style>
        <SimpleHeader title="Current Contract" />
        <div className="max-w-6xl mx-auto">
          {/* Contract Pending Notification */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#0097B2] text-white p-4">
              <h1 className="text-xl font-bold">Contract Status</h1>
              <p className="text-blue-100 mt-1">
                Your service contract information
              </p>
            </div>

            <div className="p-6">
              <div className="text-center">
                <div className="mb-6">
                  {currentJob.estadoContratacion ===
                    "PENDIENTE_FIRMA_CANDIDATO" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <AlertCircle
                        size={48}
                        className="text-red-600 mx-auto mb-4"
                      />
                      <h2 className="text-xl font-semibold text-red-800 mb-2">
                        ⚠️ Action Required: Read Contract Documents
                      </h2>
                      <p className="text-red-700 mb-4">
                        {String(currentJob.estadoContratacion) ===
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
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[75vh] flex flex-col overflow-hidden">
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
              <div className="flex-1 p-4">
                {/* Upload form for editing */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New File
                  </label>
                  <input
                    id="replacement-file-input"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setReplacementFile(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="replacement-file-input"
                    className="flex items-center gap-2 w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-[#0097B2] hover:text-[#0097B2] cursor-pointer"
                  >
                    <Upload size={16} />
                    Select the file to upload
                  </label>
                </div>

                {/* Preview and confirm */}
                {replacementFile && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Preview
                    </h3>
                    <iframe
                      src={URL.createObjectURL(replacementFile)}
                      className="w-full h-75 border border-gray-200 rounded-lg"
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
  if (isSwitchingContract) {
    return <SkeletonCurrentContract />;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style jsx global>{`
        .driver-popover-title {
          color: #0097b2;
        }
        .driver-popover {
          border-color: #0097b2;
        }
        .driver-popover-progress {
          color: #0097b2;
        }
        .driver-popover-close-btn,
        .driver-popover-next-btn,
        .driver-popover-prev-btn {
          cursor: pointer;
        }
        .driver-popover-next-btn,
        .driver-popover-prev-btn {
          background-color: #0097b2;
          color: #fff;
          border-color: #0097b2;
        }
        .driver-popover-footer .driver-popover-close-btn {
          background-color: #0097b2;
          color: #fff;
          border-color: #0097b2;
        }
      `}</style>
      <SimpleHeader title="Current Contract" />
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
        <div
          id="top-card"
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-[#0097B2] text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Current Contract</h1>
                <p className="text-blue-100 mt-1">
                  {availableContracts.length > 1
                    ? "You have multiple active contracts. Use the selector to switch between them."
                    : "Job position information and documentation"}
                </p>
              </div>
              <button
                type="button"
                onClick={startTopTour}
                aria-label="Show top section guide"
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-white/90 hover:bg-white/10 cursor-pointer"
              >
                <HelpCircle size={18} />
                {showTopHelpNudge && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
                    Help
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-4">
            {availableContracts.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Contract
                </label>
                <select
                  className="w-full lg:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                  value={selectedContractId || ""}
                  onChange={(e) => handleSelectContract(e.target.value)}
                >
                  {availableContracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.jobPosition}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the job you want to manage to upload documents and
                  generate payment inboxes.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Position Data */}
              <div id="position-details" className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900">
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
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Documentation
                </h2>

                {currentJob.contratoFinalUrl && (
                  <div className="space-y-3">
                    <div
                      id="active-contract-card"
                      className="border border-gray-200 rounded-lg p-4"
                    >
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
                    <div
                      id="active-breaks-card"
                      className="border border-gray-200 rounded-lg p-4"
                    >
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
                              <div className="w-2 h-2 bg-[#0097B2] rounded-full mt-2 shrink-0"></div>
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

        {/* Documents Management */}
        <div
          id="documents-section"
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documents
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    selectedTab === "inboxes" ? startInboxesTour() : startTour()
                  }
                  aria-label="Mostrar guía de uso"
                  className="p-1 rounded text-[#0097B2] hover:bg-blue-50 cursor-pointer"
                >
                  <HelpCircle size={18} />
                </button>
              </div>
              <div className="flex gap-2">
                {showProofsTab && (
                  <button
                    onClick={() => setSelectedTab("proofs")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedTab === "proofs"
                        ? "bg-[#0097B2] text-white cursor-pointer"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    Proofs
                  </button>
                )}
                {showInboxesTab && (
                  <button
                    onClick={() => setSelectedTab("inboxes")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedTab === "inboxes"
                        ? "bg-[#0097B2] text-white cursor-pointer"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    Invoices
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isColombiaUser
                ? "Upload your monthly proofs to enable payment processing"
                : "View your payment inboxes"}
            </p>
          </div>

          <div className="p-6">
            {selectedTab === "proofs" ? (
              <>
                {/* Tab Heading: Monthly Proofs */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Monthly Proofs
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload your monthly proofs to enable payment processing
                  </p>
                </div>
                {/* Upload Form */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Upload New Proof
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Period
                      </label>
                      <select
                        id="period-input"
                        value={
                          selectedPeriod
                            ? `${selectedPeriod.year}-${String(
                                months.indexOf(selectedPeriod.month) + 1
                              ).padStart(2, "0")}`
                            : `${currentYear}-${String(
                                currentMonthIndex + 1
                              ).padStart(2, "0")}`
                        }
                        onChange={(e) => {
                          const opt = periodOptions.find(
                            (o) => o.value === e.target.value
                          );
                          if (opt) {
                            setSelectedPeriod({
                              month: opt.month,
                              year: opt.year,
                            });
                            setSelectedMonth(opt.month);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                      >
                        {periodOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Allowed periods: current year up to {currentMonth}.
                        Exception: December 2025.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        id="file-upload-trigger"
                        htmlFor="file-upload"
                        className="flex items-center gap-2 w-full px-3 py-2 border border-dashed border-[#0097B2] rounded-lg text-[#0097B2] hover:bg-blue-50 cursor-pointer"
                      >
                        <Upload size={16} />
                        Select the file to upload
                      </label>
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
                    id="upload-proof-button"
                    onClick={handleNewProofUpload}
                    disabled={!selectedFile || !selectedMonth || uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
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
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Uploaded Proofs
                  </h3>

                  {monthlyProofs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <p>No proofs uploaded yet</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="hidden md:grid grid-cols-12 gap-2 bg-gray-50 text-xs text-gray-500 px-3 py-2">
                        <div className="col-span-4">Period</div>
                        <div className="col-span-4">File</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {monthlyProofs.map((proof) => (
                          <div
                            key={proof.id}
                            className="grid grid-cols-12 gap-2 items-center px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            <div className="col-span-12 md:col-span-4 flex items-center gap-2">
                              <Calendar size={16} className="text-[#0097B2]" />
                              <div>
                                <p className="font-medium text-gray-900 leading-tight">
                                  {proof.month} / {proof.year}
                                </p>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <Clock size={12} className="text-gray-500" />
                                  Uploaded on{" "}
                                  {new Date(
                                    proof.uploadDate
                                  ).toLocaleDateString("en-US")}
                                </p>
                              </div>
                            </div>
                            <div
                              className="col-span-10 md:col-span-4 text-gray-700 truncate"
                              title={proof.fileName}
                            >
                              {proof.fileName}
                            </div>
                            <div className="col-span-6 md:col-span-2">
                              {getStatusBadge(proof.status)}
                            </div>
                            <div className="col-span-6 md:col-span-2 flex justify-start md:justify-end gap-2">
                              <button
                                onClick={() =>
                                  window.open(proof.file, "_blank")
                                }
                                className="inline-flex items-center justify-center w-8 h-8 rounded border border-[#0097B2] text-[#0097B2] hover:bg-blue-50 cursor-pointer"
                                title="View"
                                aria-label="View proof"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  editingProofRef.current = proof;
                                  setShowEditModal(true);
                                }}
                                className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                                title="Edit"
                                aria-label="Edit proof"
                              >
                                <Upload size={16} />
                              </button>
                            </div>
                            {proof.observacionesRevision && (
                              <div className="col-span-12 mt-1">
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle
                                      size={14}
                                      className="text-yellow-600 mt-0.5"
                                    />
                                    <p className="text-xs text-yellow-800">
                                      <span className="font-medium">
                                        Observations:
                                      </span>{" "}
                                      {proof.observacionesRevision}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Invoices
                  </h3>
                  <p className="text-xs text-gray-500">
                    Recent payment invoices (newest first). Auto-loads as you
                    scroll; use the button to view more.
                  </p>
                </div>

                {/* Self-generate inbox */}
                <div
                  id="inboxes-generate-section"
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Generate Invoice
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <select
                        id="inboxes-generate-month"
                        value={genMonth || currentMonth}
                        onChange={(e) => setGenMonth(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                      >
                        {allowedMonths.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={currentYear}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        id="inboxes-generate-button"
                        onClick={handleGenerateInbox}
                        className="w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors cursor-pointer"
                      >
                        <Download size={16} />
                        Generate Invoice
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {isColombiaUser
                      ? "You can generate an inbox for a past month of the current year. For Colombia, a monthly proof must be uploaded first."
                      : "You can generate an inbox for any past month of the current year."}
                  </p>
                </div>

                <div
                  id="inboxes-list"
                  ref={setInboxScrollNode}
                  className="max-h-[60vh] overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg"
                >
                  <div className="p-4 space-y-4">
                    {inboxes.slice(0, visibleInboxCount).map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={20} className="text-[#0097B2]" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  Invoice {item.invoiceNumber} — {item.month}{" "}
                                  {item.year}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Generated on{" "}
                                  {new Date(
                                    item.generatedAt
                                  ).toLocaleDateString("en-US")}
                                </p>
                              </div>
                            </div>
                            <div className="ml-4 text-sm text-gray-700">
                              <strong>Amount:</strong> {item.currency} $
                              {item.amount.toLocaleString()}
                            </div>
                            {/* Status removed per new self-generation flow */}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                if (!item.id) {
                                  addNotification(
                                    "Invoice ID not available",
                                    "error"
                                  );
                                  return;
                                }
                                try {
                                  const res = await viewInboxPdfAction(item.id);
                                  if (!res.success) {
                                    addNotification(
                                      res.error || "Error opening invoice",
                                      "error"
                                    );
                                    return;
                                  }
                                  const base64 = res.base64;
                                  if (!base64) {
                                    addNotification(
                                      "PDF data not available",
                                      "error"
                                    );
                                    return;
                                  }
                                  const byteCharacters = atob(base64);
                                  const byteNumbers = new Array(
                                    byteCharacters.length
                                  );
                                  for (
                                    let i = 0;
                                    i < byteCharacters.length;
                                    i++
                                  ) {
                                    byteNumbers[i] =
                                      byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  const blob = new Blob([byteArray], {
                                    type: "application/pdf",
                                  });
                                  const url = URL.createObjectURL(blob);
                                  window.open(url, "_blank");
                                  setTimeout(
                                    () => URL.revokeObjectURL(url),
                                    60_000
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error opening invoice:",
                                    error
                                  );
                                  addNotification(
                                    "Error opening invoice",
                                    "error"
                                  );
                                }
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-[#0097B2] border border-[#0097B2] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!item.id}
                            >
                              <Eye size={16} />
                              View
                            </button>
                            <button
                              onClick={async () => {
                                if (!item.id) {
                                  addNotification(
                                    "Invoice ID not available",
                                    "error"
                                  );
                                  return;
                                }
                                try {
                                  const res = await downloadInboxPdfAction(
                                    item.id
                                  );
                                  if (!res.success) {
                                    addNotification(
                                      res.error || "Error downloading invoice",
                                      "error"
                                    );
                                    return;
                                  }
                                  const base64 = res.base64;
                                  if (!base64) {
                                    addNotification(
                                      "PDF data not available",
                                      "error"
                                    );
                                    return;
                                  }
                                  const byteCharacters = atob(base64);
                                  const byteNumbers = new Array(
                                    byteCharacters.length
                                  );
                                  for (
                                    let i = 0;
                                    i < byteCharacters.length;
                                    i++
                                  ) {
                                    byteNumbers[i] =
                                      byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  const blob = new Blob([byteArray], {
                                    type: "application/pdf",
                                  });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download =
                                    res.filename ||
                                    `invoice-${item.year}-${String(
                                      months.indexOf(item.month) + 1
                                    ).padStart(2, "0")}.pdf`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  setTimeout(
                                    () => URL.revokeObjectURL(url),
                                    60_000
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error downloading invoice:",
                                    error
                                  );
                                  addNotification(
                                    "Error downloading invoice",
                                    "error"
                                  );
                                }
                              }}
                              className="flex items-center gap-2 px-3 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!item.id}
                            >
                              <Download size={16} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div ref={setInboxEndSentinelNode} className="h-5" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={loadMoreInboxes}
                    disabled={
                      (!inboxNextCursor &&
                        visibleInboxCount >= inboxes.length) ||
                      loadingInboxes
                    }
                    className={`px-4 py-2 rounded ${
                      visibleInboxCount < inboxes.length || inboxNextCursor
                        ? "bg-[#0097B2] text-white hover:bg-[#007B8F] cursor-pointer"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loadingInboxes
                      ? "Loading..."
                      : inboxNextCursor || visibleInboxCount < inboxes.length
                      ? "Load more"
                      : "All loaded"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Documentos Contractuales */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-300">
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
                          className={`px-4 py-2 rounded cursor-pointer ${
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[75vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-lg font-medium text-gray-800">Edit Proof</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {/* Upload form for editing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New File
                </label>
                <input
                  id="replacement-file-input"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReplacementFile(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="replacement-file-input"
                  className="flex items-center gap-2 w-full px-3 py-2 border border-dashed border-[#0097B2] rounded-lg text-[#0097B2] hover:bg-blue-50 cursor-pointer"
                >
                  <Upload size={16} />
                  Select the file to upload
                </label>
              </div>

              {/* Preview and confirm */}
              {replacementFile && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Preview
                  </h3>
                  <iframe
                    src={URL.createObjectURL(replacementFile)}
                    className="w-full h-75 border border-gray-200 rounded-lg"
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
