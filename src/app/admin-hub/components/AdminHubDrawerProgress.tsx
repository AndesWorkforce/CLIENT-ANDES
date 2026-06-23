interface AdminHubDrawerProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export default function AdminHubDrawerProgress({
  currentStep,
  totalSteps,
  stepLabel,
}: AdminHubDrawerProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
          Paso {currentStep} de {totalSteps} ⋅ {stepLabel}
        </p>
        <p className="shrink-0 text-[14px] font-semibold leading-[1.3] text-[#C8C8C8]">
          {percent}%
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-[4px] bg-[#C8C8C8]">
        <div
          className="h-full rounded-[4px] bg-[#0097B2] transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
