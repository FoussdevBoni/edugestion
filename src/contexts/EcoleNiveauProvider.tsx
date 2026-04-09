import { ReactNode, createContext, useState, useMemo, useCallback } from "react";

export interface EcoleNiveauContextType {
  niveauSelectionne: string;
  cycleSelectionne: string;
  niveauClasseSelectionne: string;
  classeSelectionne: string;
  setNiveau: (niveau: string) => void;
  setCycle: (cycle: string) => void;
  setNiveauClasse: (niveauClasse: string) => void;
  setClasse: (classe: string) => void; 
  resetFiltres: () => void;
}

export const EcoleNiveauContext = createContext<EcoleNiveauContextType | undefined>(undefined);

export function EcoleNiveauProvider({ children }: { children: ReactNode }) {
  const [niveauSelectionne, setNiveauSelectionne] = useState("");
  const [cycleSelectionne, setCycleSelectionne] = useState("");
  const [niveauClasseSelectionne, setNiveauClasseSelectionne] = useState("");
  const [classeSelectionne, setClasseSelectionne] = useState("");

  // Utilisation de useCallback pour stabiliser les fonctions
  const setNiveau = useCallback((niveau: string) => {
    setNiveauSelectionne(niveau);
    // Cascade : Si on change de niveau (ex: Primaire -> Collège), 
    // tout ce qui est en dessous doit disparaître.
    setCycleSelectionne("");
    setNiveauClasseSelectionne("");
    setClasseSelectionne("");
  }, []);

  const setCycle = useCallback((cycle: string) => {
    setCycleSelectionne(cycle);
    setNiveauClasseSelectionne("");
    setClasseSelectionne("");
  }, []);

  const setNiveauClasse = useCallback((niveauClasse: string) => {
    setNiveauClasseSelectionne(niveauClasse);
    setClasseSelectionne("");
  }, []);

  const setClasse = useCallback((classe: string) => {
    setClasseSelectionne(classe);
  }, []);

  const resetFiltres = useCallback(() => {
    setNiveauSelectionne("");
    setCycleSelectionne("");
    setNiveauClasseSelectionne("");
    setClasseSelectionne("");
  }, []);

  // Mémorisation de la valeur pour éviter de recréer l'objet à chaque render
  const value = useMemo(() => ({
    niveauSelectionne,
    cycleSelectionne,
    niveauClasseSelectionne,
    classeSelectionne,
    setNiveau,
    setCycle,
    setNiveauClasse,
    setClasse,
    resetFiltres
  }), [niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne, setNiveau, setCycle, setNiveauClasse, setClasse, resetFiltres]);

  return (
    <EcoleNiveauContext.Provider value={value}>
      {children}
    </EcoleNiveauContext.Provider>
  );
}