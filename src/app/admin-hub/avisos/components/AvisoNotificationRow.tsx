"use client";

import Link from "next/link";
import { ArrowRight, MoreVertical } from "lucide-react";
import type { AvisoCategory, AvisoNotification } from "../types/avisos.types";
import AvisoCategoryBadge from "./AvisoCategoryBadge";
import { formatRelativeTime, t, type AdminHubTranslate } from "../../i18n";

interface AvisoNotificationRowProps {
  aviso: AvisoNotification;
  isFirst?: boolean;
  isLast?: boolean;
}

function avisoActionLabel(
  categoria: AvisoCategory,
  t: AdminHubTranslate,
): string {
  switch (categoria) {
    case "Nóminas":
      return t("avisos.goToPayrolls");
    case "Facturación":
      return t("avisos.goToPayments");
    default:
      return t("avisos.viewDetail");
  }
}

export default function AvisoNotificationRow({
  aviso,
  isFirst = false,
  isLast = false,
}: AvisoNotificationRowProps) {
  const relativeTime = aviso.creadoEn
    ? formatRelativeTime(aviso.creadoEn)
    : aviso.tiempoRelativo;

  return (
    <article
      className={`flex bg-white ${
        isLast ? "rounded-b-[12px]" : "border-b border-[#EFEFEF]"
      }`}
    >
      <div
        className={`flex w-16 shrink-0 items-start justify-center border-[#EFEFEF] bg-white px-6 pt-[34px] ${
          isFirst ? "rounded-tl-[12px] border-l border-t" : "border-l"
        } ${isLast ? "rounded-bl-[12px]" : ""}`}
      >
        {!aviso.leida ? (
          <span className="size-2 shrink-0 rounded-full bg-[#0097B2]" aria-hidden />
        ) : (
          <span className="size-2 shrink-0" aria-hidden />
        )}
      </div>

      <div
        className={`min-w-0 flex-1 bg-white py-6 pl-3 pr-6 ${
          isFirst ? "border-t border-[#EFEFEF]" : ""
        }`}
      >
        <div className="flex flex-col gap-[7px]">
          <div className="flex flex-wrap items-center gap-[7px]">
            <h3 className="text-[16px] font-semibold leading-[1.3] text-[#343434]">
              {aviso.titulo}
            </h3>
            <AvisoCategoryBadge category={aviso.categoria} />
          </div>
          <p className="text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585]">
            {aviso.descripcion}
          </p>
          <Link
            href={aviso.actionUrl}
            className="inline-flex w-fit items-center gap-1 text-[12px] font-semibold leading-[1.3] text-[#0097B2] transition-colors hover:text-[#007A8F]"
          >
            {avisoActionLabel(aviso.categoria, t)}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>

      <div
        className={`hidden w-[102px] shrink-0 bg-white py-6 pl-3 pr-[18px] sm:block ${
          isFirst ? "border-t border-[#EFEFEF]" : ""
        }`}
      >
        <p className="whitespace-nowrap text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585]">
          {relativeTime}
        </p>
      </div>

      <div
        className={`flex w-[69px] shrink-0 items-start justify-center bg-white px-6 py-6 ${
          isFirst ? "rounded-tr-[12px] border-r border-t border-[#EFEFEF]" : "border-r border-[#EFEFEF]"
        } ${isLast ? "rounded-br-[12px]" : ""}`}
      >
        <button
          type="button"
          aria-label={t("common.moreOptions")}
          className="text-[#707070] transition-colors hover:text-[#0097B2]"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </article>
  );
}
