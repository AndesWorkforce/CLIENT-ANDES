"use client";

import useRouteExclusion from "@/hooks/useRouteExclusion";

export default function Main({ children }: { children: React.ReactNode }) {
  const { isNavbarExcluded } = useRouteExclusion();

  return (
    <main className={`flex-1 ${isNavbarExcluded ? "" : "pt-[85px]"}`}>
      {children}
    </main>
  );
}
