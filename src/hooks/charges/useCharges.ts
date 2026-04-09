// src/hooks/charge/useCharge.ts
import { useEffect, useState, useCallback } from 'react';
import { chargeService } from '../../services/chargeService';
import { Charge } from '../../utils/types/data';

export default function useCharges() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharges = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chargeService.getAll();
      setCharges(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCharge = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newCharge = await chargeService.create(data);
      setCharges(prev => [...prev, newCharge]);
      return newCharge;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCharge = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await chargeService.update(id, data);
      setCharges(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCharge = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await chargeService.delete(id);
      setCharges(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getByCategorie = useCallback(async (categorie: string) => {
    try {
      return await chargeService.getByCategorie(categorie);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  const getTotalParCategorie = useCallback(async () => {
    try {
      return await chargeService.getTotalParCategorie();
    } catch (err: any) {
      setError(err.message);
      return {};
    }
  }, []);

  useEffect(() => {
    loadCharges();
  }, [loadCharges]);

  return {
    charges,
    loading,
    error,
    loadCharges,
    createCharge,
    updateCharge,
    deleteCharge,
    getByCategorie,
    getTotalParCategorie
  };
}