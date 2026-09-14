"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import {
  getAdminUsersAction,
  getAdminMfaStatusAction,
  forceResetMfaAction,
} from "./actions/mfa-admin.actions";

interface AdminUser {
  id: string;
  usuarioId: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    roles?: string[];
  };
  rol: string;
  roles?: string[];
}

interface MfaStatusInfo {
  mfaEnabled: boolean;
  mfaEnabledAt?: string;
  backupCodesRemaining?: number;
}

export default function MfaSecurityPage() {
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mfaStatuses, setMfaStatuses] = useState<
    Record<string, MfaStatusInfo | null>
  >({});
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>(
    {}
  );

  // Force-reset modal state
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetReason, setResetReason] = useState("");
  const [resetting, setResetting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const result = await getAdminUsersAction();
    if (result.success && result.data) {
      setAdmins(result.data);
      // Fetch MFA status for all admins in parallel
      const statusPromises = result.data.map(async (admin: AdminUser) => {
        const userId = admin.usuarioId || admin.usuario?.id;
        if (!userId) return;
        setLoadingStatus((prev) => ({ ...prev, [userId]: true }));
        const statusResult = await getAdminMfaStatusAction(userId);
        setLoadingStatus((prev) => ({ ...prev, [userId]: false }));
        if (statusResult.success) {
          setMfaStatuses((prev) => ({ ...prev, [userId]: statusResult.data }));
        }
      });
      await Promise.all(statusPromises);
    } else {
      addNotification(result.error || "Error loading admins", "error");
    }
    setLoading(false);
  }, [addNotification]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const fetchMfaStatus = async (user: AdminUser) => {
    const userId = user.usuarioId || user.usuario?.id;
    if (!userId || mfaStatuses[userId] !== undefined) return;

    setLoadingStatus((prev) => ({ ...prev, [userId]: true }));
    const result = await getAdminMfaStatusAction(userId);
    setLoadingStatus((prev) => ({ ...prev, [userId]: false }));

    if (result.success) {
      setMfaStatuses((prev) => ({ ...prev, [userId]: result.data }));
    }
  };

  const handleForceReset = async () => {
    if (!resetTarget || !resetReason.trim()) return;

    const userId =
      resetTarget.usuarioId || resetTarget.usuario?.id;
    setResetting(true);
    const result = await forceResetMfaAction(userId, resetReason);
    setResetting(false);

    if (result.success) {
      addNotification("MFA reset successfully", "success");
      setMfaStatuses((prev) => ({
        ...prev,
        [userId]: { mfaEnabled: false },
      }));
      setResetTarget(null);
      setResetReason("");
    } else {
      addNotification(result.error || "Error resetting MFA", "error");
    }
  };

  const filteredAdmins = admins.filter((a) => {
    const u = a.usuario;
    const q = searchQuery.toLowerCase();
    const allRoles = Array.isArray(a.roles) ? a.roles : [a.rol || u?.rol];
    return (
      u?.nombre?.toLowerCase().includes(q) ||
      u?.apellido?.toLowerCase().includes(q) ||
      u?.correo?.toLowerCase().includes(q) ||
      allRoles.some((r: string) => r?.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-3 border-[#0097B2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert size={24} className="text-[#0097B2]" />
        <h1 className="text-xl font-semibold text-gray-900">
          Admin MFA Security
        </h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
          <p className="text-sm text-gray-500">Total admins</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
          <p className="text-2xl font-bold text-green-600">
            {
              Object.values(mfaStatuses).filter((s) => s?.mfaEnabled).length
            }
          </p>
          <p className="text-sm text-gray-500">MFA active</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
          <p className="text-2xl font-bold text-orange-500">
            {admins.length -
              Object.values(mfaStatuses).filter((s) => s?.mfaEnabled).length}
          </p>
          <p className="text-sm text-gray-500">MFA pending</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email or role..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0097B2]"
        />
      </div>

      {/* Admins table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                MFA Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAdmins.map((admin) => {
              const u = admin.usuario;
              const userId = admin.usuarioId || u?.id;
              const status = mfaStatuses[userId];
              const isLoadingStatus = loadingStatus[userId];

              return (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50"
                  onMouseEnter={() => fetchMfaStatus(admin)}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {u?.nombre} {u?.apellido}
                    </p>
                    <p className="text-xs text-gray-500">{u?.correo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(admin.roles) && admin.roles.length > 1
                        ? admin.roles
                        : [admin.rol || u?.rol]
                      ).map((r: string) => (
                        <span
                          key={r}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            ["ADMIN", "EMPLEADO_ADMIN", "ADMIN_RECLUTAMIENTO"].includes(r)
                              ? "bg-[#0097B2]/10 text-[#0097B2]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isLoadingStatus ? (
                      <span className="text-xs text-gray-400">Loading...</span>
                    ) : status === undefined ? (
                      <button
                        onClick={() => fetchMfaStatus(admin)}
                        className="text-xs text-[#0097B2] hover:underline cursor-pointer"
                      >
                        Check status
                      </button>
                    ) : status?.mfaEnabled ? (
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={16} className="text-green-600" />
                        <span className="text-xs text-green-700">Active</span>
                        {status.backupCodesRemaining !== undefined && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({status.backupCodesRemaining} codes)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ShieldOff size={16} className="text-orange-500" />
                        <span className="text-xs text-orange-600">
                          Not active
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {status?.mfaEnabled && (
                      <button
                        onClick={() => setResetTarget(admin)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800
                                   hover:underline cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        Force reset
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            No admin users found
          </div>
        )}
      </div>

      {/* Force reset modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Force Reset MFA
              </h2>
              <button
                onClick={() => {
                  setResetTarget(null);
                  setResetReason("");
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              This will disable MFA for{" "}
              <span className="font-medium">
                {resetTarget.usuario?.nombre}{" "}
                {resetTarget.usuario?.apellido}
              </span>{" "}
              ({resetTarget.usuario?.correo}).
            </p>
            <p className="text-xs text-gray-400 mb-4">
              The user will be notified by email and must re-enroll on next
              login.
            </p>

            <label className="block text-sm text-gray-600 mb-1">
              Reason (required)
            </label>
            <textarea
              value={resetReason}
              onChange={(e) => setResetReason(e.target.value)}
              placeholder="e.g. User reported lost device..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-[#0097B2] resize-none"
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setResetTarget(null);
                  setResetReason("");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50
                           cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleForceReset}
                disabled={resetting || !resetReason.trim()}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {resetting ? "Resetting..." : "Confirm reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
