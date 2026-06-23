import type { ReactNode } from "react";

interface ContractFormSectionProps {
  title: string;
  children: ReactNode;
}

export default function ContractFormSection({ title, children }: ContractFormSectionProps) {
  return (
    <section className="w-full max-w-[636px] rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[18px] font-bold leading-[1.3] text-black">{title}</h3>
        {children}
      </div>
    </section>
  );
}
