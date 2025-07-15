"use client";

import { AlertCircle, Clock, XCircle } from "lucide-react";
import { ApplicationHistoryStatus } from "@/interfaces/jobs.types";

interface ApplicationStatusBadgeProps {
  historyStatus: ApplicationHistoryStatus;
  className?: string;
}

export function ApplicationStatusBadge({
  historyStatus,
  className = "",
}: ApplicationStatusBadgeProps) {
  if (!historyStatus.hasApplied) {
    return null;
  }

  if (historyStatus.isActive) {
    return (
      <div
        className={`flex items-center gap-1 text-sm font-medium text-blue-600 ${className}`}
      >
        <Clock className="h-4 w-4" />
        <span>Already applied</span>
      </div>
    );
  }

  if (historyStatus.wasRejected) {
    return (
      <div
        className={`flex items-center gap-1 text-sm font-medium text-orange-600 ${className}`}
      >
        <AlertCircle className="h-4 w-4" />
        <span>Previous application rejected</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium text-gray-600 ${className}`}
    >
      <XCircle className="h-4 w-4" />
      <span>Previously applied</span>
    </div>
  );
}
