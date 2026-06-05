"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import type { Aviso } from "../types/avisos.types";
import AvisoStatusBadge from "./AvisoStatusBadge";

interface AvisosCardProps {
  avisos: Aviso[];
}

export default function AvisosCard({ avisos }: AvisosCardProps) {
  if (avisos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#EFEFEF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#EFEFEF]">
        <Bell className="w-5 h-5 text-[#0097B2]" />
        <h2 className="text-[22px] font-bold text-[#343434] leading-[1.3]">
          Avisos
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white border-b border-[#EFEFEF]">
              <th className="text-left px-5 py-[18px] text-[12px] font-bold text-[#525252] leading-[18px]">
                Tipo
              </th>
              <th className="text-left px-5 py-[18px] text-[12px] font-bold text-[#525252] leading-[18px]">
                Estado
              </th>
              <th className="text-left px-5 py-[18px] text-[12px] font-bold text-[#525252] leading-[18px]">
                Descripción
              </th>
            </tr>
          </thead>
          <tbody>
            {avisos.map((aviso) => (
              <tr
                key={aviso.id}
                className="bg-white border-b border-[#EFEFEF] last:border-b-0"
              >
                <td className="px-5 py-[18px]">
                  {aviso.url ? (
                    <Link
                      href={aviso.url}
                      className="text-[14px] font-normal text-[#0097B2] underline decoration-solid leading-[1.1] hover:text-[#007A8F] transition-colors"
                    >
                      {aviso.tipo}
                    </Link>
                  ) : (
                    <span className="text-[14px] font-normal text-[#858585] leading-[1.1]">
                      {aviso.tipo}
                    </span>
                  )}
                </td>
                <td className="px-5 py-[18px]">
                  <AvisoStatusBadge status={aviso.estado} />
                </td>
                <td className="px-5 py-[18px]">
                  <span className="text-[14px] font-normal text-[#858585] leading-[1.1] tracking-[0.28px]">
                    {aviso.descripcion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
