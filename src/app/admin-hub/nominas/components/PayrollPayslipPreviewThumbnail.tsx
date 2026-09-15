"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { PayrollDetail } from "../types/nomina-detail.types";
import PayrollPayslipPreview from "./PayrollPayslipPreview";
import { useAdminHubI18n } from "../../i18n";

const PREVIEW_SCALE = 0.38;
const PREVIEW_BASE_WIDTH = 1100;

interface PayrollPayslipPreviewThumbnailProps {
  detail: PayrollDetail;
  onClick: () => void;
}

export default function PayrollPayslipPreviewThumbnail({
  detail,
  onClick,
}: PayrollPayslipPreviewThumbnailProps) {
  const { t } = useAdminHubI18n();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    function updateHeight() {
      if (!contentRef.current) return;
      setScaledHeight(contentRef.current.getBoundingClientRect().height);
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [detail]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("nominas.openPayslipPreview")}
      className="group relative w-full shrink-0 cursor-zoom-in overflow-hidden rounded-[8px] border border-[#EFEFEF] bg-[#f8f8f8] text-left transition-colors hover:border-[#0097B2] hover:bg-[#f5fafb]"
      style={scaledHeight ? { height: scaledHeight } : undefined}
    >
      <div
        ref={contentRef}
        className="pointer-events-none absolute left-1/2 top-0"
        style={{
          width: PREVIEW_BASE_WIDTH,
          transform: `translateX(-50%) scale(${PREVIEW_SCALE})`,
          transformOrigin: "top center",
        }}
      >
        <PayrollPayslipPreview detail={detail} interactive={false} />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-white/80 via-transparent to-transparent pb-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded-[6px] bg-[#0097B2] px-3 py-1 text-[12px] font-medium text-white">
          {t("nominas.clickToEnlarge")}
        </span>
      </div>
    </button>
  );
}
