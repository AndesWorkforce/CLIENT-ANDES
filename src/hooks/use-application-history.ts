"use client";

import { useState, useEffect } from "react";
import { checkApplicationHistory } from "@/app/pages/offers/actions/jobs.actions";
import { ApplicationHistoryStatus } from "@/interfaces/jobs.types";

export function useApplicationHistory(offerId?: string) {
  const [historyStatus, setHistoryStatus] =
    useState<ApplicationHistoryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHistory = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await checkApplicationHistory(id);

      if (result.success && result.data) {
        setHistoryStatus({
          hasApplied: result.data.hasApplied,
          wasRejected: result.data.wasRejected,
          isActive: result.data.isActive,
          applicationDate: result.data.applicationDate,
        });
      } else {
        setError(result.message || "Error checking application history");
      }
    } catch (err) {
      setError("Error checking application history");
      console.error("Application history error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (offerId) {
      checkHistory(offerId);
    }
  }, [offerId]);

  return {
    historyStatus,
    isLoading,
    error,
    checkHistory,
    refetch: () => offerId && checkHistory(offerId),
  };
}
