"use client";



import { useMemo, useState } from "react";

import { Download, Plus, Search } from "lucide-react";

import { useNotificationStore } from "@/store/notifications.store";

import type { InvoiceDetail, InvoiceLineItem } from "../data/mock-invoice-details";

import CreateInvoiceItemDrawer, { type MovementType } from "./CreateInvoiceItemDrawer";

import InvoiceClientInfoGrid from "./InvoiceClientInfoGrid";

import InvoiceDetailSection from "./InvoiceDetailSection";



type TabKey = "all" | "customer-charges" | "customer-credits";



const TABS: { key: TabKey; label: string }[] = [

  { key: "all", label: "Todos" },

  { key: "customer-charges", label: "Customer Charges" },

  { key: "customer-credits", label: "Customer Credits" },

];



interface InvoiceDetailContentProps {

  invoice: InvoiceDetail;

}



function parseAmount(amount: string): number {

  const normalized = amount.replace(/[^\d-]/g, "");

  return parseInt(normalized, 10) || 0;

}



function formatAmount(value: number, isNegative?: boolean): string {

  const abs = Math.abs(value);

  const formatted = `$${abs.toLocaleString("es-ES")}`;

  return isNegative || value < 0 ? `-${formatted}` : formatted;

}



function recalculateSectionSubtotal(items: InvoiceLineItem[]): {

  subtotal: string;

  subtotalIsNegative?: boolean;

} {

  const total = items.reduce((sum, item) => {

    const val = parseAmount(item.amount);

    return sum + (item.amountIsNegative || item.amount.startsWith("-") ? -Math.abs(val) : val);

  }, 0);



  return {

    subtotal: formatAmount(total, total < 0),

    subtotalIsNegative: total < 0,

  };

}



export default function InvoiceDetailContent({ invoice: initialInvoice }: InvoiceDetailContentProps) {

  const { addNotification } = useNotificationStore();

  const [invoice, setInvoice] = useState<InvoiceDetail>(initialInvoice);

  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);



  const visibleSections = useMemo(() => {

    let sections =

      activeTab === "all"

        ? invoice.sections

        : invoice.sections.filter((s) => s.tabKey === activeTab);



    const query = searchQuery.trim().toLowerCase();

    if (!query) return sections;



    return sections

      .map((section) => ({

        ...section,

        items: section.items.filter(

          (item) =>

            item.type.toLowerCase().includes(query) ||

            item.description.toLowerCase().includes(query) ||

            item.createdBy.toLowerCase().includes(query)

        ),

      }))

      .filter((section) => section.items.length > 0);

  }, [invoice.sections, activeTab, searchQuery]);



  function handleItemCreated(item: InvoiceLineItem, movementType: MovementType) {

    setInvoice((prev) => {

      const sections = prev.sections.map((section) => {

        if (section.tabKey !== movementType) return section;



        const items = [...section.items, item];

        const { subtotal, subtotalIsNegative } = recalculateSectionSubtotal(items);

        return { ...section, items, subtotal, subtotalIsNegative };

      });



      const chargesTotal = parseAmount(

        sections.find((s) => s.tabKey === "customer-charges")?.subtotal ?? "0"

      );

      const creditsTotal = parseAmount(

        sections.find((s) => s.tabKey === "customer-credits")?.subtotal ?? "0"

      );

      const grandTotal = chargesTotal + creditsTotal;



      return {

        ...prev,

        sections,

        grandTotal: formatAmount(grandTotal),

      };

    });



    addNotification("El ítem ingresado fue creado correctamente.", "success");

  }



  return (

    <div className="flex w-full min-w-0 flex-col gap-6">

      <div>

        <h1 className="text-[32px] font-bold text-black leading-[1.3]">Factura</h1>

        <p className="text-[16px] font-semibold text-[#343434] leading-[1.3]">

          Cliente {invoice.client} - {invoice.period}

        </p>

      </div>



      <InvoiceClientInfoGrid invoice={invoice} />



      <div className="flex flex-wrap items-center justify-end gap-3">

        <button

          type="button"

          className="inline-flex h-9 items-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] text-[#0097B2] leading-5 hover:bg-[#DFFAFF] transition-colors"

        >

          <Download size={20} />

          Exportar

        </button>

        <button

          type="button"

          onClick={() => setIsCreateItemOpen(true)}

          className="inline-flex h-9 items-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors"

        >

          <Plus size={20} />

          Crear ítem

        </button>

      </div>



      <div className="flex flex-col gap-6">

        <div className="border-b border-[#EFEFEF]">

          <div className="flex flex-wrap gap-[38px]">

            {TABS.map((tab) => {

              const isActive = activeTab === tab.key;

              return (

                <button

                  key={tab.key}

                  type="button"

                  onClick={() => setActiveTab(tab.key)}

                  className={`flex flex-col items-center gap-3.5 pb-0 text-[14px] font-medium leading-[1.2] transition-colors ${

                    isActive ? "text-[#0097B2]" : "text-[#858585] hover:text-[#0097B2]"

                  }`}

                >

                  {tab.label}

                  {isActive && <span className="h-0.5 w-full rounded-full bg-[#0097B2]" />}

                </button>

              );

            })}

          </div>

        </div>



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



        <div className="flex flex-col gap-0">

          {visibleSections.map((section) => (

            <InvoiceDetailSection key={section.id} section={section} />

          ))}

        </div>



        <div className="flex w-full items-center justify-between rounded-[8px] border border-[#0097B2] bg-white px-6 py-4">

          <span className="text-[18px] font-bold text-[#0097B2]">Total</span>

          <span className="text-[18px] font-semibold text-[#0097B2]">{invoice.grandTotal}</span>

        </div>



        <div className="flex flex-wrap items-center justify-end gap-3">

          <button

            type="button"

            className="inline-flex h-9 items-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] text-[#0097B2] leading-5 hover:bg-[#DFFAFF] transition-colors"

          >

            Guardar Cambios

          </button>

          <button

            type="button"

            className="inline-flex h-9 items-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors"

          >

            Emitir Invoice

          </button>

        </div>

      </div>



      <CreateInvoiceItemDrawer

        open={isCreateItemOpen}

        onClose={() => setIsCreateItemOpen(false)}

        onItemCreated={handleItemCreated}

      />

    </div>

  );

}


