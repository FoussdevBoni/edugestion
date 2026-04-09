// src/hooks/cycle/useCycle.ts
import { useEffect, useState, useCallback } from 'react';
import { cycleService } from '../../services/cycleService';
import { Cycle } from '../../utils/types/data';

export default function useCycles() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCycles = useCallback(async () => {
    try {
      setLoading(true);
      const cyclesData = await cycleService.getAll();
      setCycles(cyclesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCycle = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newCycle = await cycleService.create(data);
      setCycles(prev => [...prev, newCycle]);
      return newCycle;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCycle = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await cycleService.update(id, data);
      setCycles(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCycle = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await cycleService.delete(id);
      setCycles(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionnel : méthode de filtrage par niveau scolaire
  const getCyclesByNiveauScolaire = useCallback(async (niveauScolaireId: string) => {
    try {
      return await cycleService.getByNiveauScolaire(niveauScolaireId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadCycles();
  }, [loadCycles]);

  return {
    cycles,
    loading,
    error,
    loadCycles,
    createCycle,
    updateCycle,
    deleteCycle,
    getCyclesByNiveauScolaire
  };
}