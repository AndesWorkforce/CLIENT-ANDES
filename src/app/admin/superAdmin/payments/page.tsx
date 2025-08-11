"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { getContracts } from "../../dashboard/contracts/actions/contracts.actions";
import {
  updateObservations,
  enableBulkPayments,
  resetToPending,
} from "./actions/observations.actions";
import { useNotificationStore } from "@/store/notifications.store";

// Eliminamos datos hardcodeados; se cargarán desde API

// Adaptamos ProcesoContratacion para payments
type UserContract = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [enablingPayments, setEnablingPayments] = useState<boolean>(false);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string>("");
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(
    new Set()
  );

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

  useEffect(() => {
    // Filter users based on search (only among active users)
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);

    // Clear selections if they're not in the filtered list
    const filteredIds = new Set(filtered.map((user) => user.id));
    setSelectedUsers(
      (prev) => new Set([...prev].filter((id) => filteredIds.has(id)))
    );
  }, [search, users]);

  useEffect(() => {
    // Update "select all" state (only for users without enabled payments)
    const eligibleUsers = filteredUsers.filter((user) => !user.paymentEnabled);
    if (eligibleUsers.length === 0) {
      setSelectAll(false);
    } else {
      const allEligibleSelected = eligibleUsers.every((user) =>
        selectedUsers.has(user.id)
      );
      setSelectAll(allEligibleSelected);
    }
  }, [selectedUsers, filteredUsers]);

  const handleSelectAll = () => {
    const eligibleUsers = filteredUsers.filter((user) => !user.paymentEnabled);
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
    if (!user || user.paymentEnabled) return;

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
      // Obtener IDs de evaluaciones mensuales de los usuarios seleccionados
      const selectedUsersList = Array.from(selectedUsers);
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

      const result = await enableBulkPayments(evaluacionIds);

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      // Actualizar el estado local
      const currentDate = new Date().toLocaleDateString();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.has(user.id)
            ? {
                ...user,
                paymentEnabled: true,
                paymentEnabledDate: currentDate,
              }
            : user
        )
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
        const approveLastMonth = await enableBulkPayments([
          user.evaluacionMesAnteriorId,
        ]);
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
                mesAnteriorAprobado: true, // Marcar que el mes anterior fue aprobado
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
    if (processingUsers.has(user.id)) {
      return (
        <div className="flex items-center text-blue-600">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm">Processing...</span>
        </div>
      );
    }

    if (user.paymentEnabled) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle size={16} className="mr-2" />
          <span className="text-sm">Enabled</span>
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
        <h1 className="text-2xl font-bold">Monthly Payments</h1>
        <div className="flex items-center space-x-4">
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
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Total Active Users</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalUsers}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-sm text-gray-600">With Documents</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.withDocuments}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Payments Enabled</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.paymentsEnabled}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.pendingUsers}
          </div>
        </div>
      </div> */}

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
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#0097B2] focus:ring-[#0097B2] border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                User (Active Contract)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                Document This Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                Observations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors duration-300 ${
                    user.paymentEnabled
                      ? "bg-green-50 hover:bg-green-100"
                      : "hover:bg-gray-50"
                  } ${processingUsers.has(user.id) ? "bg-blue-50" : ""}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      disabled={
                        user.paymentEnabled || processingUsers.has(user.id)
                      }
                      className="h-4 w-4 text-[#0097B2] focus:ring-[#0097B2] border-gray-300 rounded disabled:opacity-50"
                    />
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
                    <div className="flex items-center">
                      {user.documentUploadedThisMonth ? (
                        <div
                          className="flex items-center text-green-600 cursor-pointer hover:bg-gray-100 rounded p-1 -m-1 transition-colors"
                          onClick={() => handleDocumentClick(user)}
                          title="Click to view document"
                        >
                          <FileCheck size={16} className="mr-2" />
                          <span className="text-sm">Yes</span>
                          {user.documentImageUrl && (
                            <Eye size={14} className="ml-2 text-gray-400" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <FileX size={16} className="mr-2" />
                          <span className="text-sm">No</span>
                        </div>
                      )}
                    </div>
                    {user.lastDocumentDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Last: {user.lastDocumentDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="max-w-xs cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                      onClick={() => handleObservationsClick(user)}
                      title="Click to add/edit observations"
                    >
                      {user.observacionesRevision ? (
                        <div className="flex items-start gap-2">
                          <AlertCircle
                            size={16}
                            className="text-yellow-600 mt-0.5 flex-shrink-0"
                          />
                          <div className="text-sm text-gray-700 break-words">
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
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
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
