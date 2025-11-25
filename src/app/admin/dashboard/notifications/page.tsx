"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppNotificationsStore } from "@/store/app-notifications.store";
import { Check, Calendar as CalendarIcon, Clock } from "lucide-react";

export default function NotificationsPage() {
  const { items, fetchLatest, markAsRead, markAllAsRead, unread } =
    useAppNotificationsStore();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchLatest(50);
      setLoading(false);
    };
    load();
  }, [fetchLatest]);

  const parseDatos = (raw?: string | null): Record<string, any> | null => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };
  // Relative time removed by request

  const tipoChip = (tipo?: string) => {
    if (!tipo) return null;
    const map: Record<string, { label: string; cls: string }> = {
      ENTREVISTA_PROGRAMADA: {
        label: "Interview",
        cls: "bg-[#E6F7FA] text-[#0E7490] border-[#0E7490]/20",
      },
      CAMBIO_ESTADO_POSTULACION: {
        label: "Status",
        cls: "bg-amber-50 text-amber-700 border-amber-700/20",
      },
      NUEVA_PROPUESTA: {
        label: "Offer",
        cls: "bg-emerald-50 text-emerald-700 border-emerald-700/20",
      },
      MENSAJE_ADMINISTRATIVO: {
        label: "Admin",
        cls: "bg-indigo-50 text-indigo-700 border-indigo-700/20",
      },
      PERFIL_INCOMPLETO: {
        label: "Profile",
        cls: "bg-rose-50 text-rose-700 border-rose-700/20",
      },
      FORMULARIO_PENDIENTE: {
        label: "Form",
        cls: "bg-sky-50 text-sky-700 border-sky-700/20",
      },
      VALIDACION_CUENTA: {
        label: "Validation",
        cls: "bg-purple-50 text-purple-700 border-purple-700/20",
      },
    };
    const v = map[tipo] || {
      label: tipo,
      cls: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border ${v.cls}`}
      >
        {v.label}
      </span>
    );
  };

  const filtered = useMemo(
    () => (tab === "unread" ? items.filter((n) => !n.leida) : items),
    [items, tab]
  );
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Unread: {unread}</span>
          <div className="hidden sm:inline-flex rounded-md border border-gray-300 overflow-hidden">
            <button
              aria-pressed={tab === "all"}
              onClick={() => setTab("all")}
              className={`px-3 py-1.5 text-sm transition cursor-pointer ${
                tab === "all"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              aria-pressed={tab === "unread"}
              onClick={() => setTab("unread")}
              className={`px-3 py-1.5 text-sm transition border-l border-gray-300 cursor-pointer ${
                tab === "unread"
                  ? "bg-[#0097B2] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Unread
            </button>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-[#0097B2] hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-sm text-gray-500">No notifications</div>
        )}
        <div className="space-y-4">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl p-5 transition shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:-translate-y-[2px] border ${
                n.leida
                  ? "bg-white border-gray-300"
                  : "bg-[#F3FBFD] border-[#BFEAF2] ring-1 ring-[#0097B2]/25"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                  <span
                    aria-hidden
                    className={`inline-block w-3 h-3 rounded-full ${
                      n.leida ? "bg-gray-300" : "bg-[#0097B2]"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold text-gray-800 truncate">
                    {n.titulo}
                  </div>
                  <div className="mt-2">{tipoChip(n.tipo)}</div>
                  <div className="mt-1 text-[13px] leading-relaxed text-gray-700 break-words">
                    {n.mensaje}
                  </div>
                  {(() => {
                    const datos = parseDatos(n.datos);
                    const fecha = datos?.fechaEntrevista as string | undefined;
                    return fecha ? (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-700">
                        <CalendarIcon size={14} className="text-[#0097B2]" />
                        <span>Interview date: {formatDateTime(fecha)}</span>
                      </div>
                    ) : null;
                  })()}
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                    <Clock size={12} />
                    <span>{formatDateTime(n.fechaCreacion)}</span>
                  </div>
                </div>
                {!n.leida && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="p-1 rounded hover:bg-gray-100 text-[#0097B2] cursor-pointer"
                    title="Mark as read"
                    aria-label="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/dashboard"
          className="text-sm text-[#0097B2] hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
