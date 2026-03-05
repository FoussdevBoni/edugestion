import { useContext } from "react";
import { EcoleNiveauContext } from "../../contexts/EcoleNiveauProvider";

// Hook personnalisé
export function useEcoleNiveau() {
  const context = useContext(EcoleNiveauContext);
  if (context === undefined) {
    throw new Error("useEcoleNiveau must be used within a EcoleNiveauProvider");
  }
  return context;
}