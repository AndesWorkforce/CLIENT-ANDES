"use client";

import { useState } from "react";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { MOCK_INVOICES, MONTH_OPTIONS } from "../data/mock-invoices";
import InvoicesTable from "./InvoicesTable";

export default function InvoicesPageContent() {
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Invoices</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-9 appearance-none rounded-[8px] border border-[#C8C8C8] bg-white pl-[22px] pr-10 text-[14px] text-[#525252] leading-5 cursor-pointer"
          >
            {MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#525252]"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors"
        >
          <Plus size={20} />
          Crear nuevo
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-[320px]">
          <Search
            size={21}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C8C8C8]"
          />
          <input
            type="search"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-[8px] border border-[#C8C8C8] bg-white pl-11 pr-4 text-[14px] font-medium text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-[8px] border border-[#C8C8C8] bg-white px-4 text-[14px] font-medium text-[#858585] hover:border-[#0097B2] hover:text-[#0097B2] transition-colors"
        >
          Filtros
          <Filter size={18} />
        </button>
      </div>

      <InvoicesTable invoices={MOCK_INVOICES} searchQuery={searchQuery} />
    </div>
  );
}
