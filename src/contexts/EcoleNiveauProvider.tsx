// contexts/EcoleNiveauContext.tsx
import { ReactNode, createContext, useState } from "react";

// Types pour le contexte
export interface EcoleNiveauContextType {
  niveauSelectionne: string;
  cycleSelectionne: string;
  niveauxScolaires: typeof niveauxScolaires;
  setNiveau: (niveau: string) => void;
  setCycle: (cycle: string) => void;
  resetFiltres: () => void;
}

// Données des niveaux et cycles (provenant de la configuration de l'école)
const niveauxScolaires = [
  {
    nom: "Préscolaire",
    cycles: ["Maternelle"]
  },
  {
    nom: "Primaire",
    cycles: ["Primaire"]
  },
  {
    nom: "Secondaire",
    cycles: ["1er cycle (Collège)", "2ème cycle (Lycée)"]
  }
];

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
    niveauxScolaires,
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

