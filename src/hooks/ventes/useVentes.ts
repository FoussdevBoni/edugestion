// src/hooks/ventes/useVentes.ts
import { useEffect, useState, useCallback } from 'react';
import { venteService } from '../../services/venteService';
import { Vente } from '../../utils/types/data';

export default function useVentes() {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVentes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await venteService.getAll();
      setVentes(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVente = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newVente = await venteService.create(data);
      setVentes(prev => [...prev, newVente]);
      return newVente;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVente = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await venteService.update(id, data);
      setVentes(prev => prev.map(v => v.id === id ? updated : v));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVente = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await venteService.delete(id);
      setVentes(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVentes();
  }, [loadVentes]);

  return {
    ventes,
    loading,
    error,
    loadVentes,
    createVente,
    updateVente,
    deleteVente
  };
}