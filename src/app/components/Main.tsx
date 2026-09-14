"use client";

import useRouteExclusion from "@/hooks/useRouteExclusion";

export default function Main({ children }: { children: React.ReactNode }) {
  const { isNavbarExcluded, isHeroOverlayPage } = useRouteExclusion();

  return (
    <main
      className={`flex-1 ${
        isNavbarExcluded || isHeroOverlayPage ? "" : "pt-[85px]"
      }`}
    >
      {children}
    </main>
  );
}
