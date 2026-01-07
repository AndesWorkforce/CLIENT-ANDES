"use client";

import { useEffect, useState, useMemo } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import * as XLSX from "xlsx";
import {
  Search,
  FileCheck,
  FileX,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
  Download,
} from "lucide-react";
import {
  viewInboxPdfAction,
  downloadInboxPdfAction,
} from "./actions/invoices.actions";
import { getContracts } from "../../dashboard/contracts/actions/contracts.actions";
import {
  updateObservations,
  enableBulkPayments,
  resetToPending,
  getInboxesPresenceBulk,
} from "./actions/observations.actions";
import { useNotificationStore } from "@/store/notifications.store";

type UserContract = {
  id: string;
  usuarioId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  country?: string | null;
  documentUploadedThisMonth: boolean;
  lastDocumentDate: string | null;
  documentImageUrl: string | null;
  paymentEnabled: boolean;
  paymentEnabledDate: string | null;
  // Datos para gestión de evaluaciones
  evaluacionMensualId?: string | null;
  observacionesRevision?: string | null;
  documentoRevisado?: boolean;
  // Agregar campos para el mes anterior
  mesAnteriorAprobado?: boolean;
  evaluacionMesAnteriorId?: string | null;
  // Información de la empresa/cliente
  companyName?: string | null;
  // Presencia de inbox del mes actual
  inboxMesActualId?: string | null;
  inboxMesActualAñoMes?: string | null;
};

interface ActionLog {
  id: string;
  action: string;
  timestamp: string;
  usersAffected: number;
}

export default function PaymentsPage() {
  const [users, setUsers] = useState<UserContract[]>([]);
  const { addNotification } = useNotificationStore();
  const [filteredUsers, setFilteredUsers] = useState<UserContract[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<
    "all" | "colombia" | "rest"
  >("all");
  const [documentFilter, setDocumentFilter] = useState<"all" | "yes" | "no">(
    "all"
  );
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    now.getMonth() + 1
  ); // 1-12
  const [loading, setLoading] = useState<boolean>(true);
  const [enablingPayments, setEnablingPayments] = useState<boolean>(false);
  const [preparingInvoices, setPreparingInvoices] = useState<boolean>(false);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string>("");
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(
    new Set()
  );

  // Guided tour for this page
  const startPaymentsTour = () => {
    const d = driver({
      showProgress: true,
      allowClose: true,
      stagePadding: 6,
      steps: [
        {
          element: "#payments-title",
          popover: {
            title: "Monthly Payments",
            description:
              "Manage monthly payments: filter, review documents, and enable payments (Colombia only).",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#filter-country",
          popover: {
            title: "Country filter",
            description:
              "Use Colombia/Rest to segment. Only Colombia users can be selected and enabled.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#filter-period",
          popover: {
            title: "Period (Year/Month)",
            description:
              "Choose year and month. Future months are disabled and selection auto-clamps when needed.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#filter-document",
          popover: {
            title: "Document (Period)",
            description:
              "Filter by delivered or missing for the selected period. For non‑Colombia, documents are not required.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#select-all-checkbox",
          popover: {
            title: "Select all (Colombia)",
            description:
              "Select only eligible Colombia users. Rows from other countries cannot be checked.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#col-document-header",
          popover: {
            title: "Document column (Period)",
            description:
              "Shows if a document is delivered in the selected period. In the current month, you can open the evidence when available.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#col-invoices-header",
          popover: {
            title: "Invoices (All countries)",
            description:
              "Shows invoice availability when present. Monthly invoicing applies to all countries; monthly payment enablement is for Colombia.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#payments-title",
          popover: {
            title: "Enable payments (Colombia)",
            description:
              "Select Colombia users only and use 'Enable Monthly Payments'. If a non‑Colombia user is selected, we’ll alert you to deselect them.",
            side: "bottom",
            align: "start",
          },
        },
      ],
    });
    d.drive();
  };

  // Utilidad: normalizar texto para búsqueda (sin acentos, espacios colapsados)
  const normalizeText = (value: string) =>
    String(value || "")
      .normalize("NFD")
      // @ts-ignore - soporte unicode property escapes
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  // Estados para sorting
  const [sortKey, setSortKey] = useState<keyof UserContract | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Estados para exportación
  const [isExporting, setIsExporting] = useState(false);

  console.log(!!actionLogs);

  // Modal states
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    imageUrl: string;
    userName: string;
    date: string;
  } | null>(null);

  // Estados para modal de observaciones
  const [showObservationsModal, setShowObservationsModal] = useState(false);
  const [selectedUserForObservations, setSelectedUserForObservations] =
    useState<UserContract | null>(null);
  const [observationsText, setObservationsText] = useState("");
  const [savingObservations, setSavingObservations] = useState(false);

  // Estado para resetear a pending
  const [resettingUser, setResettingUser] = useState<string | null>(null);

  // Función para manejar el sorting
  const handleSort = (key: keyof UserContract) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Función para exportar a Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      // Usar todos los usuarios (no solo los filtrados)
      const dataToExport = users.map((user) => ({
        "Full Name": `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Company: user.companyName || "N/A",
        "Document This Month": user.documentUploadedThisMonth ? "Yes" : "No",
        "Last Document Date": user.lastDocumentDate || "N/A",
        "Payment Enabled": user.paymentEnabled ? "Yes" : "No",
        "Payment Enabled Date": user.paymentEnabledDate || "N/A",
        Observations: user.observacionesRevision || "None",
        "Document Reviewed": user.documentoRevisado ? "Yes" : "No",
        "Previous Month Approved": user.mesAnteriorAprobado ? "Yes" : "No",
        "Has Evaluation ID": user.evaluacionMensualId ? "Yes" : "No",
        "Has Previous Month Evaluation": user.evaluacionMesAnteriorId
          ? "Yes"
          : "No",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Payments");

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 25 }, // Full Name
        { wch: 30 }, // Email
        { wch: 25 }, // Company
        { wch: 20 }, // Document This Month
        { wch: 18 }, // Last Document Date
        { wch: 15 }, // Payment Enabled
        { wch: 18 }, // Payment Enabled Date
        { wch: 40 }, // Observations
        { wch: 18 }, // Document Reviewed
        { wch: 22 }, // Previous Month Approved
        { wch: 18 }, // Has Evaluation ID
        { wch: 25 }, // Has Previous Month Evaluation
      ];
      worksheet["!cols"] = columnWidths;

      const fileName = `monthly-payments-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);

      addNotification(
        `Excel file exported successfully: ${fileName}`,
        "success"
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      addNotification("Error exporting to Excel", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Función para usuarios ordenados
  const sortedUsers = useMemo(() => {
    if (!sortKey) {
      // Default: place completed (paymentEnabled) at the end
      return [...filteredUsers].sort((a, b) =>
        a.paymentEnabled === b.paymentEnabled ? 0 : a.paymentEnabled ? 1 : -1
      );
    }

    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? 1 : -1;
      if (bValue == null) return sortDirection === "asc" ? -1 : 1;

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        const comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
        return sortDirection === "asc" ? comparison : -comparison;
      }

      // Default comparison
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredUsers, sortKey, sortDirection]);

  useEffect(() => {
    const loadActiveContracts = async () => {
      setLoading(true);
      try {
        const response = await getContracts(1, 1000, ""); // Traer todos los contratos

        if (response.success && response.data) {
          // Transformar ProcesoContratacion a UserContract
          const transformedUsers: UserContract[] = response.data.resultados
            .filter((contrato) => contrato.activo) // Solo contratos activos
            .map((contrato) => ({
              id: contrato.id, // Este es el ID del proceso de contratación
              usuarioId: (contrato as any)?.postulacion?.candidatoId || null,
              country: (contrato as any).pais || null,
              firstName: contrato.nombreCompleto.split(" ")[0] || "",
              lastName:
                contrato.nombreCompleto.split(" ").slice(1).join(" ") || "",
              email: contrato.correo,
              documentUploadedThisMonth:
                contrato.documentoSubidoEsteMes || false,
              lastDocumentDate: contrato.fechaUltimoDocumento
                ? new Date(contrato.fechaUltimoDocumento).toLocaleDateString()
                : null,
              documentImageUrl: contrato.urlDocumentoMesActual || null,
              paymentEnabled: contrato.salarioPagado || false,
              paymentEnabledDate: contrato.salarioPagado
                ? new Date().toLocaleDateString()
                : null,
              // Datos para gestión de evaluaciones
              evaluacionMensualId: contrato.evaluacionMensualId || null,
              observacionesRevision: contrato.observacionesRevision || null,
              documentoRevisado: contrato.documentoRevisado || false,
              // Agregar campos para el mes anterior
              mesAnteriorAprobado: contrato.mesAnteriorAprobado || false,
              evaluacionMesAnteriorId: contrato.evaluacionMesAnteriorId || null,
              // Información de la empresa/cliente
              companyName: contrato.clienteNombre || null,
              // Presencia de inbox del mes actual proveniente del backend
              inboxMesActualId: (contrato as any).inboxMesActualId || null,
              inboxMesActualAñoMes:
                (contrato as any).inboxMesActualAñoMes || null,
            }));

          setUsers(transformedUsers);
          setFilteredUsers(transformedUsers);

          // Add some initial logs
          setActionLogs([
            {
              id: "1",
              action: "Contracts loaded successfully",
              timestamp: new Date().toLocaleString(),
              usersAffected: transformedUsers.length,
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActiveContracts();
  }, []);

  // Eliminado: ya no necesitamos cargar presencia de inbox en el cliente

  // Helpers para filtro por período
  const isSelectedCurrentPeriod = useMemo(() => {
    const d = new Date();
    return (
      selectedYear === d.getFullYear() && selectedMonth === d.getMonth() + 1
    );
  }, [selectedYear, selectedMonth]);

  const getPreviousYearMonth = (y: number, m: number) => {
    return m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
  };

  const isSelectedPreviousPeriod = useMemo(() => {
    const d = new Date();
    const p = getPreviousYearMonth(d.getFullYear(), d.getMonth() + 1);
    return selectedYear === p.y && selectedMonth === p.m;
  }, [selectedYear, selectedMonth]);

  // Evitar selección de meses futuros en el año actual
  useEffect(() => {
    const currY = now.getFullYear();
    const currM = now.getMonth() + 1;
    const prev = getPreviousYearMonth(currY, currM);
    // Clamp future month in current year
    if (selectedYear === currY && selectedMonth > currM) {
      setSelectedMonth(currM);
      return;
    }
    // When previous year is selected, clamp to the actual previous month
    if (selectedYear === prev.y && selectedMonth !== prev.m) {
      setSelectedMonth(prev.m);
      return;
    }
  }, [selectedYear, selectedMonth]);

  const hasDocForPeriod = (user: UserContract) => {
    const isColombia = String(user.country || "").toLowerCase() === "colombia";
    if (isColombia) {
      if (isSelectedCurrentPeriod) return !!user.documentUploadedThisMonth;
      if (isSelectedPreviousPeriod)
        return !!user.mesAnteriorAprobado || !!user.evaluacionMesAnteriorId;
      return false;
    }
    // Para no-Colombia, usamos presencia de inbox para el mes actual si está disponible
    if (isSelectedCurrentPeriod) return !!user.inboxMesActualId;
    return false;
  };

  useEffect(() => {
    // Filter users based on search (accent/space insensitive among active users)
    const q = normalizeText(search);
    const filteredBySearch = users.filter((user) => {
      if (!q) return true;
      const fullName = normalizeText(`${user.firstName} ${user.lastName}`);
      const email = normalizeText(user.email);
      const countryN = normalizeText(user.country || "");
      const company = normalizeText(user.companyName || "");
      return (
        fullName.includes(q) ||
        email.includes(q) ||
        countryN.includes(q) ||
        company.includes(q)
      );
    });

    const filteredByCountry = filteredBySearch.filter((user) => {
      if (countryFilter === "all") return true;
      const isColombia =
        String(user.country || "").toLowerCase() === "colombia";
      return countryFilter === "colombia" ? isColombia : !isColombia;
    });

    let filtered = filteredByCountry.filter((user) => {
      if (documentFilter === "all") return true;
      const hasDoc = hasDocForPeriod(user);
      return documentFilter === "yes" ? hasDoc : !hasDoc;
    });
    // Always include completed users (paymentEnabled), even if the document filter would exclude them
    const completedUsers = filteredByCountry.filter(
      (user) => user.paymentEnabled
    );
    const completedIds = new Set(completedUsers.map((u) => u.id));
    const existingIds = new Set(filtered.map((u) => u.id));
    const merged = [
      ...filtered,
      ...completedUsers.filter((u) => !existingIds.has(u.id)),
    ];
    setFilteredUsers(merged);

    // Clear selections if they're not in the filtered list
    const filteredIds = new Set(merged.map((user) => user.id));
    setSelectedUsers(
      (prev) => new Set([...prev].filter((id) => filteredIds.has(id)))
    );
  }, [
    search,
    users,
    countryFilter,
    documentFilter,
    selectedYear,
    selectedMonth,
  ]);

  useEffect(() => {
    // Update "select all" state: allow selecting Colombians even if paymentEnabled
    const eligibleUsers = filteredUsers.filter((user) => {
      const isColombia =
        String(user.country || "").toLowerCase() === "colombia";
      if (processingUsers.has(user.id)) return false;
      // Only Colombians are eligible for monthly enablement
      return isColombia;
    });
    if (eligibleUsers.length === 0) {
      setSelectAll(false);
    } else {
      const allEligibleSelected = eligibleUsers.every((user) =>
        selectedUsers.has(user.id)
      );
      setSelectAll(allEligibleSelected);
    }
  }, [selectedUsers, filteredUsers, processingUsers]);

  const handleSelectAll = () => {
    const eligibleUsers = filteredUsers.filter((user) => {
      const isColombia =
        String(user.country || "").toLowerCase() === "colombia";
      if (processingUsers.has(user.id)) return false;
      return isColombia; // Only Colombians
    });
    if (selectAll) {
      // Deselect all eligible users
      const newSelected = new Set(selectedUsers);
      eligibleUsers.forEach((user) => newSelected.delete(user.id));
      setSelectedUsers(newSelected);
    } else {
      // Select all eligible users
      const newSelected = new Set(selectedUsers);
      eligibleUsers.forEach((user) => newSelected.add(user.id));
      setSelectedUsers(newSelected);
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (processingUsers.has(user.id)) return;
    const isColombia = String(user.country || "").toLowerCase() === "colombia";
    const canSelect = isColombia;
    if (!canSelect) return;

    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleDocumentClick = (user: UserContract) => {
    // Solo proceder si tiene documento del mes actual
    if (!user.documentImageUrl) {
      console.log("No document URL available for user:", user);
      return;
    }

    setSelectedDocument({
      imageUrl: user.documentImageUrl,
      userName: `${user.firstName} ${user.lastName}`,
      date: user.lastDocumentDate || "",
    });
    setShowDocumentModal(true);
  };

  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
  };

  const handleObservationsClick = (user: UserContract) => {
    setSelectedUserForObservations(user);
    setObservationsText(user.observacionesRevision || "");
    setShowObservationsModal(true);
  };

  const closeObservationsModal = () => {
    setShowObservationsModal(false);
    setSelectedUserForObservations(null);
    setObservationsText("");
  };

  const saveObservations = async () => {
    if (!selectedUserForObservations?.evaluacionMensualId) {
      alert("No se encontró evaluación mensual para este usuario");
      return;
    }

    setSavingObservations(true);
    try {
      const result = await updateObservations(
        selectedUserForObservations.evaluacionMensualId,
        observationsText
      );

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      // Actualizar el estado local
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUserForObservations.id
            ? { ...user, observacionesRevision: observationsText }
            : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUserForObservations.id
            ? { ...user, observacionesRevision: observationsText }
            : user
        )
      );

      closeObservationsModal();
      addNotification("Observations saved successfully", "success");
    } catch (error) {
      console.error("Error saving observations:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addNotification(`Error saving observations`, "error");
    } finally {
      setSavingObservations(false);
    }
  };

  const handleEnablePayments = async () => {
    if (selectedUsers.size === 0) return;

    setEnablingPayments(true);
    setProcessingUsers(new Set(selectedUsers));

    try {
      // Validar selección: solo usuarios de Colombia
      const selectedUsersList = Array.from(selectedUsers);
      const hasNonColombia = selectedUsersList.some((userId) => {
        const user = users.find((u) => u.id === userId);
        return String(user?.country || "").toLowerCase() !== "colombia";
      });
      if (hasNonColombia) {
        addNotification(
          "Only Colombia users can be enabled. Please deselect non-Colombia users.",
          "error"
        );
        return;
      }
      // Obtener IDs de evaluaciones mensuales de los usuarios seleccionados
      const evaluacionIds = selectedUsersList
        .map((userId) => {
          const user = users.find((u) => u.id === userId);
          return user?.evaluacionMensualId;
        })
        .filter((id): id is string => id !== null && id !== undefined);
      if (evaluacionIds.length === 0) {
        throw new Error(
          "No se encontraron evaluaciones mensuales para los usuarios seleccionados"
        );
      }
      const result = await enableBulkPayments(evaluacionIds, []);

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      // Actualizar el estado local
      const currentDate = new Date().toLocaleDateString();
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (!selectedUsers.has(user.id)) return user;
          const isColombia =
            String(user.country || "").toLowerCase() === "colombia";
          return {
            ...user,
            // Solo marcamos paymentEnabled para Colombia; para no-Colombia se genera Inbox y permanece Pending
            paymentEnabled: isColombia ? true : user.paymentEnabled,
            paymentEnabledDate: isColombia
              ? currentDate
              : user.paymentEnabledDate,
          };
        })
      );

      // Mantener lista filtrada sincronizada
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (!selectedUsers.has(user.id)) return user;
          const isColombia =
            String(user.country || "").toLowerCase() === "colombia";
          return {
            ...user,
            paymentEnabled: isColombia ? true : user.paymentEnabled,
            paymentEnabledDate: isColombia
              ? currentDate
              : user.paymentEnabledDate,
          };
        })
      );

      const currentDateTime = new Date().toLocaleString();
      const newLog: ActionLog = {
        id: Date.now().toString(),
        action: `Payment enabled for ${
          result.data?.evaluacionesActualizadas || 0
        } user(s)`,
        timestamp: currentDateTime,
        usersAffected: result.data?.evaluacionesActualizadas || 0,
      };

      setActionLogs((prev) => [newLog, ...prev]);
      setLastActionMessage(
        result.message ||
          `Successfully enabled monthly payments for ${
            result.data?.evaluacionesActualizadas || 0
          } user(s)`
      );
      setShowSuccessMessage(true);
      setSelectedUsers(new Set());

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error("Error enabling payments:", error);
      addNotification(`Error enabling payments`, "error");
    } finally {
      setEnablingPayments(false);
      setProcessingUsers(new Set());
    }
  };

  const handleResetToPending = async (user: UserContract) => {
    if (!user.id) return;

    setResettingUser(user.id);
    try {
      // Primero aprobar el mes anterior si existe evaluación
      if (user.evaluacionMesAnteriorId) {
        const approveLastMonth = await enableBulkPayments(
          [user.evaluacionMesAnteriorId],
          []
        );
        if (!approveLastMonth.success) {
          throw new Error("Error aprobando el mes anterior");
        }
      }

      // Luego resetear el mes actual a pending
      const result = await resetToPending(user.id);

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      // Actualizar el estado local
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id
            ? {
                ...u,
                documentoRevisado: false,
                observacionesRevision: null,
                documentUploadedThisMonth: false,
                lastDocumentDate: null,
                documentImageUrl: null,
                paymentEnabled: false,
                mesAnteriorAprobado: true,
              }
            : u
        )
      );

      setLastActionMessage(
        `Se aprobó el mes anterior y se reseteó el mes actual para ${user.firstName} ${user.lastName}`
      );
      setShowSuccessMessage(true);

      // Agregar al log
      setActionLogs((prev) => [
        {
          id: Date.now().toString(),
          action: `Reset manual y aprobación del mes anterior para ${user.firstName} ${user.lastName}`,
          timestamp: new Date().toLocaleString(),
          usersAffected: 1,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error resetting evaluation:", error);
      addNotification(
        "Error en el proceso. Por favor intente nuevamente.",
        "error"
      );
    } finally {
      setResettingUser(null);
    }
  };

  // Bulk: prepare invoices by fetching inbox presence for selected users
  const handlePrepareInvoices = async () => {
    if (selectedUsers.size === 0) return;
    setPreparingInvoices(true);
    try {
      const procesoContratacionIds = Array.from(selectedUsers);
      const presence = await getInboxesPresenceBulk(procesoContratacionIds);
      if (!presence.success || !presence.data) {
        addNotification(presence.error || "Error preparing invoices", "error");
        return;
      }
      const mapByProceso: Record<string, { id: string; añoMes: string }> = {};
      for (const it of presence.data) {
        mapByProceso[it.procesoContratacionId] = {
          id: it.id,
          añoMes: it.añoMes,
        };
      }
      setUsers((prev) =>
        prev.map((u) =>
          mapByProceso[u.id]
            ? {
                ...u,
                inboxMesActualId: mapByProceso[u.id].id,
                inboxMesActualAñoMes: mapByProceso[u.id].añoMes,
              }
            : u
        )
      );
      setFilteredUsers((prev) =>
        prev.map((u) =>
          mapByProceso[u.id]
            ? {
                ...u,
                inboxMesActualId: mapByProceso[u.id].id,
                inboxMesActualAñoMes: mapByProceso[u.id].añoMes,
              }
            : u
        )
      );
      const found = Object.keys(mapByProceso).length;
      addNotification(
        found > 0
          ? `Prepared invoices for ${found} user(s)`
          : "No invoices found for selected users",
        found > 0 ? "success" : "error"
      );
    } catch (error) {
      console.error("Error preparing invoices:", error);
      addNotification("Error preparing invoices", "error");
    } finally {
      setPreparingInvoices(false);
    }
  };

  const handleViewInvoice = async (inboxId: string, añoMes?: string | null) => {
    try {
      const res = await viewInboxPdfAction(inboxId);
      if (!res.success) {
        addNotification(res.error || "Error opening invoice", "error");
        return;
      }
      if (!res.base64) {
        addNotification("Error: No PDF data received", "error");
        return;
      }
      const byteCharacters = atob(res.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error("Error opening invoice PDF:", error);
      addNotification(
        `Error opening invoice${añoMes ? ` ${añoMes}` : ""}`,
        "error"
      );
    }
  };

  const handleDownloadInvoice = async (
    inboxId: string,
    añoMes?: string | null
  ) => {
    try {
      const res = await downloadInboxPdfAction(inboxId);

      if (!res.success) {
        addNotification(res.error || "Error downloading invoice", "error");
        return;
      }
      if (!res.base64) {
        addNotification("Error: No PDF data received", "error");
        return;
      }
      const byteCharacters = atob(res.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = res.filename || `invoice-${añoMes || "current"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error("Error downloading invoice PDF:", error);
      addNotification(
        `Error downloading invoice${añoMes ? ` ${añoMes}` : ""}`,
        "error"
      );
    }
  };

  // Función para determinar si mostrar el botón de reset
  const shouldShowResetButton = (user: UserContract) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDocDate = user.lastDocumentDate
      ? new Date(user.lastDocumentDate)
      : null;

    // Mostrar el botón solo si:
    // 1. El usuario tiene una evaluación pendiente del mes anterior
    // 2. No tiene el mes anterior aprobado
    // 3. Estamos en un nuevo mes
    return (
      !user.mesAnteriorAprobado &&
      user.evaluacionMesAnteriorId &&
      lastDocDate &&
      lastDocDate < firstDayOfMonth
    );
  };

  const getPaymentStatus = (user: UserContract) => {
    const isColombia = String(user.country || "").toLowerCase() === "colombia";
    if (processingUsers.has(user.id)) {
      return (
        <div className="flex items-center text-blue-600">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm">Processing...</span>
        </div>
      );
    }

    // Colombia: usar flujo de habilitación
    if (isColombia) {
      if (user.paymentEnabled) {
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-2" />
            <span className="text-sm">Enabled</span>
          </div>
        );
      }
      if (user.documentUploadedThisMonth) {
        return (
          <div className="flex items-center text-yellow-600">
            <AlertCircle size={16} className="mr-2" />
            <span className="text-sm">In review</span>
          </div>
        );
      }
      return (
        <div className="flex items-center text-gray-500">
          <Clock size={16} className="mr-2" />
          <span className="text-sm">Pending</span>
        </div>
      );
    }

    // No-Colombia: si existe inbox del mes actual, mostrarlo como estado principal
    if (user.inboxMesActualId) {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
            <CheckCircle size={12} className="mr-1" /> Invoice{" "}
            {user.inboxMesActualAñoMes}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-500">
        <Clock size={16} className="mr-2" />
        <span className="text-sm">Pending</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 id="payments-title" className="text-2xl font-bold">
          Monthly Payments
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToExcel}
            disabled={isExporting}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
              isExporting
                ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                : "bg-[#0097B2] text-white hover:bg-[#007B8F]"
            }`}
            title="Export all users to Excel"
          >
            {isExporting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                Exporting...
              </>
            ) : (
              <>📊 Export to Excel</>
            )}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={startPaymentsTour}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 cursor-pointer"
            title="Open guided tour"
          >
            ❔
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div id="filter-country" className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Country:</span>
          <div className="inline-flex rounded-md overflow-hidden border border-gray-200">
            <button
              onClick={() => setCountryFilter("all")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                countryFilter === "all"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCountryFilter("colombia")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer border-l border-gray-200 ${
                countryFilter === "colombia"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Colombia
            </button>
            <button
              onClick={() => setCountryFilter("rest")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer border-l border-gray-200 ${
                countryFilter === "rest"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Rest
            </button>
          </div>
        </div>

        <div id="filter-period" className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Period:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer"
            title="Select year"
          >
            <option value={now.getFullYear()}>{now.getFullYear()}</option>
            <option value={now.getFullYear() - 1}>
              {now.getFullYear() - 1}
            </option>
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer"
            title="Select month"
          >
            <option
              value={1}
              disabled={
                (selectedYear === now.getFullYear() &&
                  1 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  1 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Jan
            </option>
            <option
              value={2}
              disabled={
                (selectedYear === now.getFullYear() &&
                  2 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  2 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Feb
            </option>
            <option
              value={3}
              disabled={
                (selectedYear === now.getFullYear() &&
                  3 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  3 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Mar
            </option>
            <option
              value={4}
              disabled={
                (selectedYear === now.getFullYear() &&
                  4 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  4 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Apr
            </option>
            <option
              value={5}
              disabled={
                (selectedYear === now.getFullYear() &&
                  5 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  5 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              May
            </option>
            <option
              value={6}
              disabled={
                (selectedYear === now.getFullYear() &&
                  6 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  6 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Jun
            </option>
            <option
              value={7}
              disabled={
                (selectedYear === now.getFullYear() &&
                  7 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  7 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Jul
            </option>
            <option
              value={8}
              disabled={
                (selectedYear === now.getFullYear() &&
                  8 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  8 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Aug
            </option>
            <option
              value={9}
              disabled={
                (selectedYear === now.getFullYear() &&
                  9 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  9 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Sep
            </option>
            <option
              value={10}
              disabled={
                (selectedYear === now.getFullYear() &&
                  10 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  10 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Oct
            </option>
            <option
              value={11}
              disabled={
                (selectedYear === now.getFullYear() &&
                  11 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  11 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Nov
            </option>
            <option
              value={12}
              disabled={
                (selectedYear === now.getFullYear() &&
                  12 > now.getMonth() + 1) ||
                (selectedYear ===
                  getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                    .y &&
                  12 !==
                    getPreviousYearMonth(now.getFullYear(), now.getMonth() + 1)
                      .m)
              }
            >
              Dec
            </option>
          </select>
        </div>

        <div id="filter-document" className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Document:</span>
          <div className="inline-flex rounded-md overflow-hidden border border-gray-200">
            <button
              onClick={() => setDocumentFilter("all")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                documentFilter === "all"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDocumentFilter("yes")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer border-l border-gray-200 ${
                documentFilter === "yes"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setDocumentFilter("no")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer border-l border-gray-200 ${
                documentFilter === "no"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Not delivered
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div className="text-green-800">{lastActionMessage}</div>
        </div>
      )}

      {/* Selection Actions */}
      {selectedUsers.size > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#0097B2]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {selectedUsers.size} user(s) selected for monthly payment
              enablement
            </div>
            <button
              onClick={handleEnablePayments}
              disabled={enablingPayments}
              className="bg-[#0097B2] text-white px-6 py-2 rounded-lg hover:bg-[#007B8E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {enablingPayments ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Enable Monthly Payments
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  id="select-all-checkbox"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#0097B2] focus:ring-[#0097B2] border-gray-300 rounded"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center space-x-1">
                  <span>User (Active Contract)</span>
                  <div className="flex flex-col text-xs text-gray-400">
                    {sortKey === "firstName" && sortDirection === "asc" ? (
                      <span className="text-blue-600">▲</span>
                    ) : sortKey === "firstName" && sortDirection === "desc" ? (
                      <span className="text-blue-600">▼</span>
                    ) : (
                      <span className="opacity-50">⇅</span>
                    )}
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <div className="flex flex-col text-xs text-gray-400">
                    {sortKey === "email" && sortDirection === "asc" ? (
                      <span className="text-blue-600">▲</span>
                    ) : sortKey === "email" && sortDirection === "desc" ? (
                      <span className="text-blue-600">▼</span>
                    ) : (
                      <span className="opacity-50">⇅</span>
                    )}
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("country")}
              >
                <div className="flex items-center space-x-1">
                  <span>Country</span>
                  <div className="flex flex-col text-xs text-gray-400">
                    {sortKey === "country" && sortDirection === "asc" ? (
                      <span className="text-blue-600">▲</span>
                    ) : sortKey === "country" && sortDirection === "desc" ? (
                      <span className="text-blue-600">▼</span>
                    ) : (
                      <span className="opacity-50">⇅</span>
                    )}
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("companyName")}
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  <div className="flex flex-col text-xs text-gray-400">
                    {sortKey === "companyName" && sortDirection === "asc" ? (
                      <span className="text-blue-600">▲</span>
                    ) : sortKey === "companyName" &&
                      sortDirection === "desc" ? (
                      <span className="text-blue-600">▼</span>
                    ) : (
                      <span className="opacity-50">⇅</span>
                    )}
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("documentUploadedThisMonth")}
              >
                <div className="flex items-center space-x-1">
                  <span id="col-document-header">Document (Period)</span>
                  <div className="flex flex-col text-xs text-gray-400">
                    {sortKey === "documentUploadedThisMonth" &&
                    sortDirection === "asc" ? (
                      <span className="text-blue-600">▲</span>
                    ) : sortKey === "documentUploadedThisMonth" &&
                      sortDirection === "desc" ? (
                      <span className="text-blue-600">▼</span>
                    ) : (
                      <span className="opacity-50">⇅</span>
                    )}
                  </div>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                Observations
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("paymentEnabled")}
              >
                <div className="flex items-center space-x-1">
                  <span>Payment Status</span>
                  <div className="flex flex-col text-xs text-gray-400">
                    {sortKey === "paymentEnabled" && sortDirection === "asc" ? (
                      <span className="text-blue-600">▲</span>
                    ) : sortKey === "paymentEnabled" &&
                      sortDirection === "desc" ? (
                      <span className="text-blue-600">▼</span>
                    ) : (
                      <span className="opacity-50">⇅</span>
                    )}
                  </div>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                <span id="col-invoices-header">Invoices</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors duration-300 ${
                    user.paymentEnabled
                      ? "bg-green-50 hover:bg-green-100"
                      : "hover:bg-gray-50"
                  } ${processingUsers.has(user.id) ? "bg-blue-50" : ""}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const isCol =
                        String(user.country || "").toLowerCase() === "colombia";
                      return (
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          disabled={processingUsers.has(user.id) || !isCol}
                          title={
                            !isCol
                              ? "Only Colombia users can be enabled"
                              : undefined
                          }
                          className="h-4 w-4 text-[#0097B2] focus:ring-[#0097B2] border-gray-300 rounded disabled:opacity-50"
                        />
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#17323A]">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {(user.country || "N/A").toString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {user.companyName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const isCol =
                        String(user.country || "").toLowerCase() === "colombia";
                      const hasDoc = hasDocForPeriod(user);
                      if (!isCol) {
                        return (
                          <span className="text-xs text-gray-400">
                            Not required
                          </span>
                        );
                      }
                      return (
                        <>
                          <div className="flex items-center">
                            {hasDoc ? (
                              <div
                                className={`flex items-center text-green-600 ${
                                  isSelectedCurrentPeriod &&
                                  user.documentImageUrl
                                    ? "cursor-pointer hover:bg-gray-100 rounded p-1 -m-1 transition-colors"
                                    : ""
                                }`}
                                onClick={() =>
                                  isSelectedCurrentPeriod &&
                                  user.documentImageUrl
                                    ? handleDocumentClick(user)
                                    : undefined
                                }
                                title={
                                  isSelectedCurrentPeriod &&
                                  user.documentImageUrl
                                    ? "Click to view document"
                                    : undefined
                                }
                              >
                                <FileCheck size={16} className="mr-2" />
                                <span className="text-sm">Yes</span>
                                {isSelectedCurrentPeriod &&
                                  user.documentImageUrl && (
                                    <Eye
                                      size={14}
                                      className="ml-2 text-blue-600"
                                    />
                                  )}
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <FileX size={16} className="mr-2" />
                                <span className="text-sm">No</span>
                              </div>
                            )}
                          </div>
                          {user.lastDocumentDate && isSelectedCurrentPeriod && (
                            <div className="text-xs text-gray-500 mt-1">
                              Last: {user.lastDocumentDate}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    {String(user.country || "").toLowerCase() === "colombia" ? (
                      <div
                        className="max-w-xs cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                        onClick={() => handleObservationsClick(user)}
                        title="Click to add/edit observations"
                      >
                        {user.observacionesRevision ? (
                          <div className="flex items-start gap-2">
                            <AlertCircle
                              size={16}
                              className="text-yellow-600 mt-0.5 shrink-0"
                            />
                            <div className="text-sm text-gray-700">
                              {user.observacionesRevision}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span className="text-sm">Add observations</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Not required
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatus(user)}
                    {user.paymentEnabled && user.paymentEnabledDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Enabled: {user.paymentEnabledDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shouldShowResetButton(user) ? (
                      <button
                        onClick={() => handleResetToPending(user)}
                        disabled={resettingUser === user.id}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Aprobar mes anterior y resetear mes actual"
                      >
                        {resettingUser === user.id ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>Aprobar y Resetear</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <></>
                    )}
                    {user.inboxMesActualId && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleViewInvoice(
                              user.inboxMesActualId as string,
                              user.inboxMesActualAñoMes
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                          title={`View invoice ${
                            user.inboxMesActualAñoMes || "current"
                          }`}
                        >
                          <Eye size={14} className="text-blue-700" /> View
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadInvoice(
                              user.inboxMesActualId as string,
                              user.inboxMesActualAñoMes
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                          title={`Download invoice ${
                            user.inboxMesActualAñoMes || "current"
                          }`}
                        >
                          <Download size={14} /> Download
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    {search
                      ? "No users found for this search"
                      : "No users with active contracts found"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Logs */}
      {/* {actionLogs.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-[#17323A] mb-4">
            Recent Actions
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {actionLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
              >
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-2" />
                  <span className="text-gray-800">{log.action}</span>
                </div>
                <span className="text-gray-500">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Footer Info */}
      {/* <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>How it works:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Green rows:</strong> Users with payments already enabled
            </li>
            <li>
              <strong>Blue rows:</strong> Users currently being processed
            </li>
            <li>
              <strong>Only users with active contracts</strong> are shown in
              this list
            </li>
            <li>
              <strong>Click on document status</strong> to view uploaded
              document image
            </li>
            <li>
              <strong>Select All</strong> will choose all eligible users at
              once
            </li>
            <li>
              <strong>Real-time feedback</strong> shows processing status and
              completion
            </li>
          </ul>
        </div>
      </div> */}

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-medium text-[#17323A]">
                  Document - {selectedDocument.userName}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded: {selectedDocument.date}
                </p>
              </div>
              <button
                onClick={closeDocumentModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <div className="space-y-4">
                {/* Mostrar PDF en iframe */}
                {selectedDocument.imageUrl.toLowerCase().includes(".pdf") ? (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="text-center space-y-4">
                      <div className="text-gray-600">
                        <svg
                          className="w-16 h-16 mx-auto mb-2 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                        <p className="text-lg font-medium">PDF Document</p>
                        <p className="text-sm text-gray-500">
                          Click below to open the document in a new tab
                        </p>
                      </div>
                      <div className="space-y-2">
                        <a
                          href={selectedDocument.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Open PDF Document
                        </a>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              selectedDocument.imageUrl
                            )
                          }
                          className="ml-2 inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy URL
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Para imágenes */
                  <div className="flex justify-center">
                    <img
                      src={selectedDocument.imageUrl}
                      alt={`Document for ${selectedDocument.userName}`}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/400x300/f5f5f5/999999?text=Document+Not+Available";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={closeDocumentModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Observations Modal */}
      {showObservationsModal && selectedUserForObservations && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-medium text-[#17323A]">
                  Observations - {selectedUserForObservations.firstName}{" "}
                  {selectedUserForObservations.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  Current Month Evaluation
                </p>
              </div>
              <button
                onClick={closeObservationsModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observations for this month:
                </label>
                <textarea
                  value={observationsText}
                  onChange={(e) => setObservationsText(e.target.value)}
                  placeholder="Add observations about the monthly document or performance..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent resize-none"
                  disabled={savingObservations}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {observationsText.length}/500 characters
                </div>
              </div>

              {/* Info about user */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Email:</strong> {selectedUserForObservations.email}
                  </div>
                  <div>
                    <strong>Document This Month:</strong>
                    <span
                      className={`ml-1 ${
                        selectedUserForObservations.documentUploadedThisMonth
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUserForObservations.documentUploadedThisMonth
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                  {selectedUserForObservations.lastDocumentDate && (
                    <div>
                      <strong>Last Document:</strong>{" "}
                      {selectedUserForObservations.lastDocumentDate}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={closeObservationsModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={savingObservations}
              >
                Cancel
              </button>
              <button
                onClick={saveObservations}
                disabled={savingObservations}
                className="px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007a94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingObservations && (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                {savingObservations ? "Saving..." : "Save Observations"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
