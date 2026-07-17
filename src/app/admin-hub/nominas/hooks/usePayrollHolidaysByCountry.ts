"use client";

import { useEffect, useState } from "react";
import { getHolidaysByCountryCode } from "../actions/payroll-holidays.actions";
import type { PayrollHolidayOption } from "../lib/payroll-holidays";

export function usePayrollHolidaysByCountry(codigoPais: string | null | undefined) {
  const [holidays, setHolidays] = useState<PayrollHolidayOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = codigoPais?.trim();
    if (!code) {
      setHolidays([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const result = await getHolidaysByCountryCode(code!);
      if (cancelled) return;
      setHolidays(result.data ?? []);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [codigoPais]);

  return { holidays, loading };
}
