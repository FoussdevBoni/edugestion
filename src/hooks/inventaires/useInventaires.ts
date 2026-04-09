// src/hooks/inventaire/useInventaire.ts
import { useEffect, useState, useCallback } from 'react';
import { inventaireService } from '../../services/inventaireService';
import { Inventaire } from '../../utils/types/data';

export default function useInventaires() {
  const [inventaires, setInventaires] = useState<Inventaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInventaires = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventaireService.getAll();
      setInventaires(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createInventaire = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newInventaire = await inventaireService.create(data);
      setInventaires(prev => [...prev, newInventaire]);
      return newInventaire;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInventaire = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await inventaireService.update(id, data);
      setInventaires(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInventaire = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await inventaireService.delete(id);
      setInventaires(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDernier = useCallback(async () => {
    try {
      return await inventaireService.getDernier();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const comparerAvecStockActuel = useCallback(async (id: string, stockActuel: any[]) => {
    try {
      return await inventaireService.comparerAvecStockActuel(id, stockActuel);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadInventaires();
  }, [loadInventaires]);

  return {
    inventaires,
    loading,
    error,
    loadInventaires,
    createInventaire,
    updateInventaire,
    deleteInventaire,
    getDernier,
    comparerAvecStockActuel
  };
}