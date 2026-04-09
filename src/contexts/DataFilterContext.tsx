// contexts/EcoleNiveauContext.tsx
import { ReactNode, createContext, useState } from "react";

// Types pour le contexte
export interface EcoleNiveauContextType {
  niveauSelectionne: string;
  cycleSelectionne: string;
  setNiveau: (niveau: string) => void;
  setCycle: (cycle: string) => void;
  resetFiltres: () => void;
}




// Création du contexte
export const EcoleNiveauContext = createContext<EcoleNiveauContextType | undefined>(undefined);

// Provider
interface EcoleNiveauProviderProps {
  children: ReactNode;
}

export function EcoleNiveauProvider({ children }: EcoleNiveauProviderProps) {
  const [niveauSelectionne, setNiveauSelectionne] = useState("");
  const [cycleSelectionne, setCycleSelectionne] = useState("");

  const setNiveau = (niveau: string) => {
    setNiveauSelectionne(niveau);
    setCycleSelectionne(""); // Réinitialiser le cycle quand le niveau change
  };

  const setCycle = (cycle: string) => {
    setCycleSelectionne(cycle);
  };

  const resetFiltres = () => {
    setNiveauSelectionne("");
    setCycleSelectionne("");
  };

  const value = {
    niveauSelectionne,
    cycleSelectionne,
    setNiveau,
    setCycle,
    resetFiltres
  };

  return (
    <EcoleNiveauContext.Provider value={value}>
      {children}
    </EcoleNiveauContext.Provider>
  );
}

