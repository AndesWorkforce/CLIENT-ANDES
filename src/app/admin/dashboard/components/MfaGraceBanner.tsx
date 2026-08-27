"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { getMfaStatusAction } from "../security/actions/mfa-settings.actions";

const MFA_REQUIRED_ROLES = ["ADMIN", "EMPLEADO_ADMIN", "ADMIN_RECLUTAMIENTO"];
const GRACE_PERIOD_DAYS = 14;
const BANNER_DISMISS_KEY = "andes_mfa_banner_dismissed";

export default function MfaGraceBanner() {
  const { user } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const check = useCallback(async () => {
    if (!user?.rol || !MFA_REQUIRED_ROLES.includes(user.rol)) return;

    const dismissed = sessionStorage.getItem(BANNER_DISMISS_KEY);
    if (dismissed === "true") return;

    try {
      const result = await getMfaStatusAction();
      if (result.success && !result.data?.mfaEnabled) {
        const createdAt = result.data?.gracePeriodStart || new Date().toISOString();
        const start = new Date(createdAt);
        const deadline = new Date(start);
        deadline.setDate(deadline.getDate() + GRACE_PERIOD_DAYS);

        const remaining = Math.max(
          0,
          Math.ceil(
            (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        );
        setDaysLeft(remaining);
        setVisible(true);
      }
    } catch {
      // silently ignore - banner is non-critical
    }
  }, [user?.rol]);

  useEffect(() => {
    check();
  }, [check]);

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_DISMISS_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  const isUrgent = daysLeft !== null && daysLeft <= 3;

  return (
    <div
      className={`relative px-4 py-3 text-sm flex items-center gap-3 ${
        isUrgent
          ? "bg-red-50 border-b border-red-200 text-red-800"
          : "bg-amber-50 border-b border-amber-200 text-amber-800"
      }`}
    >
      <ShieldAlert size={18} className="flex-shrink-0" />
      <div className="flex-1">
        <span className="font-medium">
          Two-factor authentication is required for your role.
        </span>{" "}
        {daysLeft !== null && daysLeft > 0 ? (
          <span>
            You have{" "}
            <span className="font-bold">
              {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </span>{" "}
            left to set it up.
          </span>
        ) : (
          <span>Please set it up now to continue using the admin panel.</span>
        )}
        <Link
          href="/admin/dashboard/security"
          className={`ml-2 underline font-medium ${
            isUrgent
              ? "text-red-700 hover:text-red-900"
              : "text-amber-700 hover:text-amber-900"
          }`}
        >
          Set up MFA
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 cursor-pointer"
        title="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
