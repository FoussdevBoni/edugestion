// src/hooks/niveauScolaire/useNiveauScolaire.ts
import { useEffect, useState, useCallback } from 'react';
import { niveauScolaireService } from '../../services/niveauScolaireService';
import { NiveauScolaire } from '../../utils/types/data';

export default function useNiveauxScolaires() {
  const [niveauxScolaires, setNiveauxScolaires] = useState<NiveauScolaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNiveaux = useCallback(async () => {
    try {
      setLoading(true);
      const data = await niveauScolaireService.getAll();
      setNiveauxScolaires(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNiveau = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newNiveau = await niveauScolaireService.create(data);
      setNiveauxScolaires(prev => [...prev, newNiveau]);
      return newNiveau;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNiveau = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await niveauScolaireService.update(id, data);
      setNiveauxScolaires(prev => prev.map(n => n.id === id ? updated : n));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNiveau = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await niveauScolaireService.delete(id);
      setNiveauxScolaires(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNiveaux();
  }, [loadNiveaux]);

  return {
    niveauxScolaires,
    loading,
    error,
    loadNiveaux,
    createNiveau,
    updateNiveau,
    deleteNiveau
  };
}