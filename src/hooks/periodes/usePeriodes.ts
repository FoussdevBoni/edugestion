// src/hooks/periode/usePeriode.ts
import { useEffect, useState, useCallback } from 'react';
import { periodeService } from '../../services/periodeService';
import { Periode } from '../../utils/types/data';

export default function usePeriodes() {
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPeriodes = useCallback(async () => {
    try {
      setLoading(true);
      const periodesData = await periodeService.getAll();
      setPeriodes(periodesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPeriode = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newPeriode = await periodeService.create(data);
      setPeriodes(prev => [...prev, newPeriode]);
      return newPeriode;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePeriode = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await periodeService.update(id, data);
      setPeriodes(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePeriode = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await periodeService.delete(id);
      setPeriodes(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionnel : obtenir les périodes par niveau scolaire
  const getByNiveauScolaire = useCallback(async (niveauScolaireId: string) => {
    try {
      return await periodeService.getByNiveauScolaire(niveauScolaireId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  // Optionnel : obtenir les périodes par année scolaire
  const getByAnneeScolaire = useCallback(async (anneeScolaire: string) => {
    try {
      return await periodeService.getByAnneeScolaire(anneeScolaire);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadPeriodes();
  }, [loadPeriodes]);

  return {
    periodes,
    loading,
    error,
    loadPeriodes,
    createPeriode,
    updatePeriode,
    deletePeriode,
    getByNiveauScolaire,
    getByAnneeScolaire
  };
}