// src/hooks/mouvementStock/useMouvementStock.ts
import { useEffect, useState, useCallback } from 'react';
import { mouvementStockService } from '../../services/mouvementStockService';
import { MouvementStock } from '../../utils/types/data';

export default function useMouvementsStock() {
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMouvements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mouvementStockService.getAll();
      setMouvements(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByMateriel = useCallback(async (materielId: string) => {
    try {
      return await mouvementStockService.getByMateriel(materielId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadMouvements();
  }, [loadMouvements]);

  return {
    mouvements,
    loading,
    error,
    getByMateriel
  };
}