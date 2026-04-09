// src/hooks/niveauClasse/useNiveauClasse.ts
import { useEffect, useState, useCallback } from 'react';
import { niveauClasseService } from '../../services/niveauClasseService';
import { NiveauClasse } from '../../utils/types/data';
import { useEcoleNiveau } from '../filters/useEcoleNiveau';
import { filterByCycleAndNiveau } from '../../shared/filterByCycleAndNiveau';

export default function useNiveauxClasses() {
  const [niveauxClasse, setNiveauxClasse] = useState<NiveauClasse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau()

  const loadNiveauxClasse = useCallback(async () => {
    try {
      setLoading(true);
      const niveauxData = await niveauClasseService.getAll();
      const filtreredData: NiveauClasse[] = filterByCycleAndNiveau(cycleSelectionne, niveauSelectionne,
        niveauxData)
      setNiveauxClasse(filtreredData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cycleSelectionne, niveauSelectionne]);

  const createNiveauClasse = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newNiveau = await niveauClasseService.create(data);
      setNiveauxClasse(prev => [...prev, newNiveau]);
      return newNiveau;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNiveauClasse = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await niveauClasseService.update(id, data);
      setNiveauxClasse(prev => prev.map(n => n.id === id ? updated : n));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNiveauClasse = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await niveauClasseService.delete(id);
      setNiveauxClasse(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionnel : méthode de filtrage par cycle
  const getNiveauxByCycle = useCallback(async (cycleId: string) => {
    try {
      return await niveauClasseService.getByCycle(cycleId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadNiveauxClasse();
  }, [loadNiveauxClasse]);

  return {
    niveauxClasse,
    loading,
    error,
    loadNiveauxClasse,
    createNiveauClasse,
    updateNiveauClasse,
    deleteNiveauClasse,
    getNiveauxByCycle
  };
}