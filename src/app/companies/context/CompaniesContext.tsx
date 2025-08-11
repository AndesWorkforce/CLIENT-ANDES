"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface CompaniesContextType {
  showStatusModal: boolean;
  setShowStatusModal: (showStatusModal: boolean) => void;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(
  undefined
);

export function CompaniesProvider({ children }: { children: ReactNode }) {
  // Aquí irá la lógica del provider
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  return (
    <CompaniesContext.Provider value={{ showStatusModal, setShowStatusModal }}>
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompaniesContext);
  if (context === undefined) {
    throw new Error("useCompanies must be used within a CompaniesProvider");
  }
  return context;
}
