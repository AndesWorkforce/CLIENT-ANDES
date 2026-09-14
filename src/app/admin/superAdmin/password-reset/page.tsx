"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import {
  searchUsersForPasswordResetAction,
  sendPasswordResetEmailAction,
  setUserPasswordAction,
  type PasswordResetUser,
} from "./actions/password-reset.actions";

const PASSWORD_RULE =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

function generateTemporaryPassword(length = 12): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%";
  const all = `${upper}${lower}${digits}${special}`;
  const pick = (source: string) =>
    source[Math.floor(Math.random() * source.length)];

  const chars = [pick(upper), pick(lower), pick(digits), pick(special)];
  while (chars.length < length) {
    chars.push(pick(all));
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

export default function PasswordResetPage() {
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<PasswordResetUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [emailTarget, setEmailTarget] = useState<PasswordResetUser | null>(
    null
  );
  const [sendingEmail, setSendingEmail] = useState(false);

  const [passwordTarget, setPasswordTarget] =
    useState<PasswordResetUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [reason, setReason] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await searchUsersForPasswordResetAction(
      debouncedSearch,
      page,
      20
    );
    if (result.success && result.data) {
      setUsers(result.data);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.total || result.data.length);
    } else {
      addNotification(result.error || "Error loading users", "error");
    }
    setLoading(false);
  }, [addNotification, debouncedSearch, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSendResetEmail = async () => {
    if (!emailTarget) return;
    setSendingEmail(true);
    const result = await sendPasswordResetEmailAction(emailTarget.correo);
    setSendingEmail(false);

    if (result.success) {
      addNotification(
        result.message || "Reset email sent if the account exists",
        "success"
      );
      setEmailTarget(null);
    } else {
      addNotification(result.error || "Error sending reset email", "error");
    }
  };

  const handleSetPassword = async () => {
    if (!passwordTarget) return;
    if (newPassword.length < 8) {
      addNotification("Password must be at least 8 characters", "error");
      return;
    }
    if (!PASSWORD_RULE.test(newPassword)) {
      addNotification(
        "Password must include uppercase, lowercase and a number or special character",
        "error"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      addNotification("Passwords do not match", "error");
      return;
    }
    if (reason.trim().length < 10) {
      addNotification("Reason must be at least 10 characters", "error");
      return;
    }

    setSavingPassword(true);
    const result = await setUserPasswordAction(
      passwordTarget.correo,
      newPassword,
      reason.trim()
    );
    setSavingPassword(false);

    if (result.success) {
      addNotification(
        result.message || "Password updated successfully",
        "success"
      );
      setPasswordTarget(null);
      setNewPassword("");
      setConfirmPassword("");
      setReason("");
      setShowPassword(false);
    } else {
      addNotification(result.error || "Error updating password", "error");
    }
  };

  const closePasswordModal = () => {
    setPasswordTarget(null);
    setNewPassword("");
    setConfirmPassword("");
    setReason("");
    setShowPassword(false);
  };

  const copyGeneratedPassword = async () => {
    if (!newPassword) return;
    try {
      await navigator.clipboard.writeText(newPassword);
      addNotification("Password copied", "success");
    } catch {
      addNotification("Could not copy password", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-2">
        <KeyRound size={24} className="text-[#0097B2]" />
        <h1 className="text-xl font-semibold text-gray-900">Password reset</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Reset a user password by sending a recovery email, or set a temporary
        password directly. Direct changes are audited and require a reason.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-sm text-gray-500">Users in this search</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-700">
            Recovery emails use the existing reset flow. Direct password changes
            are limited to Super Admin.
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0097B2]"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-3 border-[#0097B2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.nombre} {user.apellido}
                    </p>
                    <p className="text-xs text-gray-500">{user.correo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(user.roles && user.roles.length > 0
                        ? user.roles
                        : [user.rol]
                      ).map((role) => (
                        <span
                          key={role}
                          className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEmailTarget(user)}
                        className="inline-flex items-center gap-1 text-xs text-[#0097B2] hover:underline cursor-pointer"
                      >
                        <Mail size={14} />
                        Send reset email
                      </button>
                      <button
                        onClick={() => setPasswordTarget(user)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                      >
                        <KeyRound size={14} />
                        Set password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            No users found
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <button
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {emailTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Send reset email
              </h2>
              <button
                onClick={() => setEmailTarget(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              A recovery link will be sent to{" "}
              <span className="font-medium">
                {emailTarget.nombre} {emailTarget.apellido}
              </span>{" "}
              ({emailTarget.correo}). The user will choose a new password.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEmailTarget(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendResetEmail}
                disabled={sendingEmail}
                className="flex-1 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] disabled:opacity-50 cursor-pointer text-sm"
              >
                {sendingEmail ? "Sending..." : "Send email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Set new password
              </h2>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This will replace the password for{" "}
              <span className="font-medium">
                {passwordTarget.nombre} {passwordTarget.apellido}
              </span>{" "}
              ({passwordTarget.correo}).
            </p>

            <label className="block text-sm text-gray-600 mb-1">
              New password
            </label>
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pr-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0097B2]"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  type="button"
                  onClick={copyGeneratedPassword}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const generated = generateTemporaryPassword();
                setNewPassword(generated);
                setConfirmPassword(generated);
                setShowPassword(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#0097B2] hover:underline cursor-pointer mb-3"
            >
              <RefreshCw size={12} />
              Generate temporary password
            </button>

            <label className="block text-sm text-gray-600 mb-1">
              Confirm password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0097B2] mb-3"
            />

            <label className="block text-sm text-gray-600 mb-1">
              Reason (required)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. User requested support after being locked out..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0097B2] resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={closePasswordModal}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSetPassword}
                disabled={
                  savingPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  reason.trim().length < 10
                }
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {savingPassword ? "Saving..." : "Confirm reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
