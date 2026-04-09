// src/hooks/materiel/useMateriel.ts
import { useEffect, useState, useCallback } from 'react';
import { materielService } from '../../services/materielService';
import { Materiel } from '../../utils/types/data';

export default function useMateriels() {
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMateriels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await materielService.getAll();
      setMateriels(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMateriel = useCallback(async (data: Partial<Materiel>) => {
    try {
      setLoading(true);
      const newMateriel = await materielService.create(data);
      setMateriels(prev => [...prev, newMateriel]);
      return newMateriel;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMateriel = useCallback(async (id: string, data: Partial<Materiel>) => {
    try {
      setLoading(true);
      const updated = await materielService.update(id, data);
      setMateriels(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMateriel = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await materielService.delete(id);
      setMateriels(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStockBas = useCallback(async (seuil: number = 10) => {
    try {
      return await materielService.getStockBas(seuil);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadMateriels();
  }, [loadMateriels]);

  return {
    materiels,
    loading,
    error,
    loadMateriels,
    createMateriel,
    updateMateriel,
    deleteMateriel,
    getStockBas
  };
}