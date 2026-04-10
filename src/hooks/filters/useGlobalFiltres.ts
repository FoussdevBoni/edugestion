// src/hooks/dashboard/useDashboardFiltres.ts
import { useState, useEffect, useRef } from "react";
import { initialisationService } from "../../services/initialisationService";
import { alertSuccess, alertServerError } from "../../helpers/alertError";

interface UseGlobalFiltresProps {
  niveauxScolaires: any[];
  cycles: any[];
  onNiveauChange: (niveau: string) => void;
  onCycleChange: (cycle: string) => void;
  onResetFiltres: () => void;
  onNiveauxMisAJour?: () => void;
}

export default function useDashboardFiltres({
  niveauxScolaires,
  cycles,
  onNiveauChange,
  onCycleChange,
  onResetFiltres,
  onNiveauxMisAJour
  
}: UseGlobalFiltresProps) {
  const [showNiveauxModal, setShowNiveauxModal] = useState(false);
  const [niveauxDisponibles, setNiveauxDisponibles] = useState<any[]>([]);
  const [niveauxASelectionner, setNiveauxASelectionner] = useState<Set<string>>(new Set());
  const [loadingNiveaux, setLoadingNiveaux] = useState(false);
  
  const defaultNiveauApplied = useRef(false);
  const defaultCycleApplied = useRef(false);

  const plusieursNiveaux = niveauxScolaires.length > 1;

  // Sélection automatique du premier niveau si plusieurs
  useEffect(() => {
    if (plusieursNiveaux && niveauxScolaires.length > 0 && !defaultNiveauApplied.current) {
      if (!niveauxScolaires.some(n => n.nom === onNiveauChange.toString())) {
        onNiveauChange(niveauxScolaires[0].nom);
        defaultNiveauApplied.current = true;
      }
    }
  }, [plusieursNiveaux, niveauxScolaires, onNiveauChange]);

  // Cycles disponibles basés sur le niveau sélectionné
  const cyclesDisponibles = cycles
    .filter(item => {
      if (!onNiveauChange || onNiveauChange.toString() === "") return true;
      return item.niveauScolaire?.toLowerCase().trim() === onNiveauChange.toString()?.toLowerCase().trim();
    })
    .map((cycle) => cycle.nom)
    .filter((value, index, self) => self.indexOf(value) === index);

  const plusieursCycles = cyclesDisponibles.length > 1;

  // Sélection automatique du premier cycle si plusieurs
  useEffect(() => {
    if (plusieursCycles && cyclesDisponibles.length > 0 && !defaultCycleApplied.current) {
      onCycleChange(cyclesDisponibles[0]);
      defaultCycleApplied.current = true;
    }
  }, [plusieursCycles, cyclesDisponibles, onCycleChange]);

  // Réinitialiser les flags quand les données changent
  useEffect(() => {
    defaultNiveauApplied.current = false;
    defaultCycleApplied.current = false;
  }, [niveauxScolaires.length, cycles.length]);

  const loadNiveauxDisponibles = async () => {
    try {
      setLoadingNiveaux(true);
      const niveaux = await initialisationService.getNiveauxDisponibles("senegal");
      const existants = new Set(niveauxScolaires.map(n => n.nom));
      const disponibles = niveaux.filter(n => !existants.has(n.nom));
      setNiveauxDisponibles(disponibles.sort((a, b) => a.ordre - b.ordre));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNiveaux(false);
    }
  };

  const handleAjouterNiveaux = async () => {
    if (niveauxASelectionner.size === 0) return;
    
    try {
      const result = await initialisationService.importerNiveauxScolaires(
        "senegal",
        Array.from(niveauxASelectionner)
      );
      
      if (result.success) {
        alertSuccess(`${result.resultats?.niveauxScolaires.ajoutes} nouveau(x) niveau(x) ajouté(s) !`);
        setShowNiveauxModal(false);
        setNiveauxASelectionner(new Set());
        
        // Rafraîchir les données
        if (onNiveauxMisAJour) {
          onNiveauxMisAJour();
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      alertServerError(err);
    }
  };

  const toggleNiveau = (nom: string) => {
    const newSet = new Set(niveauxASelectionner);
    if (newSet.has(nom)) {
      newSet.delete(nom);
    } else {
      newSet.add(nom);
    }
    setNiveauxASelectionner(newSet);
  };

  const handleNiveauChange = (value: string) => {
    defaultNiveauApplied.current = true;
    onNiveauChange(value);
  };

  const handleCycleChange = (value: string) => {
    defaultCycleApplied.current = true;
    onCycleChange(value);
  };

  const handleResetFiltres = () => {
    defaultNiveauApplied.current = true;
    defaultCycleApplied.current = true;
    onResetFiltres();
  };

  return {
    // États
    showNiveauxModal,
    setShowNiveauxModal,
    niveauxDisponibles,
    niveauxASelectionner,
    loadingNiveaux,
    plusieursNiveaux,
    cyclesDisponibles,
    plusieursCycles,
    
    // Actions
    loadNiveauxDisponibles,
    handleAjouterNiveaux,
    toggleNiveau,
    handleNiveauChange,
    handleCycleChange,
    handleResetFiltres
  };
}