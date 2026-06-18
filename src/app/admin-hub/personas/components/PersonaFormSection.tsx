import type { ReactNode } from "react";

interface PersonaFormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function PersonaFormSection({
  title,
  children,
  className = "",
}: PersonaFormSectionProps) {
  return (
    <section
      className={`rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6 ${className}`}
    >
      <h2 className="mb-2.5 text-[18px] font-bold leading-[1.3] text-black">{title}</h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}
