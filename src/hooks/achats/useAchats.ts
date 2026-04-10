// src/hooks/achat/useAchat.ts
import { useEffect, useState, useCallback } from 'react';
import { achatService } from '../../services/achatService';
import { Achat } from '../../utils/types/data';

export default function useAchats() {
  const [achats, setAchats] = useState<Achat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAchats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await achatService.getAll(); // ← backend fait tout le travail
      setAchats(data);
    } catch (err: any) {

      setError(err.message);
      throw err
    } finally {
      setLoading(false);
    }
  }, []);

  const createAchat = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newAchat = await achatService.create(data); // ← backend crée l'achat + transaction + met à jour stock
      setAchats(prev => [...prev, newAchat]);
      return newAchat;
    } catch (err: any) {
      setError(err.message);
      throw err

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAchat = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await achatService.update(id, data); // ← backend met à jour l'achat + transaction + stock
      setAchats(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAchat = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await achatService.delete(id); // ← backend supprime l'achat + transaction + ajuste stock
      setAchats(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchats();
  }, [loadAchats]);

  return {
    achats,
    loading,
    error,
    loadAchats,
    createAchat,
    updateAchat,
    deleteAchat
  };
}