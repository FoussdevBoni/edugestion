// src/hooks/paiement/usePaiement.ts
import { useEffect, useState, useCallback } from 'react';
import { paiementService } from '../../services/paiementService';
import { Paiement } from '../../utils/types/data';
import {  FilterData } from '../../utils/types/others';




export default function usePaiements({ where = {}, options = {} }: FilterData = {}) {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaiements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await paiementService.getData(where , options);
      setPaiements(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaiement = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newPaiement = await paiementService.create(data);
      setPaiements(prev => [...prev, newPaiement]);
      return newPaiement;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaiement = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await paiementService.update(id, data);
      setPaiements(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePaiement = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await paiementService.delete(id);
      setPaiements(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);



  const getTotalParInscription = useCallback(async (inscriptionId: string) => {
    try {
      return await paiementService.getTotalParInscription(inscriptionId);
    } catch (err: any) {
      setError(err.message);
      return 0;
    }
  }, []);

  useEffect(() => {
    loadPaiements();
  }, [loadPaiements]);

  return {
    paiements,
    loading,
    error,
    loadPaiements,
    createPaiement,
    updatePaiement,
    deletePaiement,
    getTotalParInscription
  };
}