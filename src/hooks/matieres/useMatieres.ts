// src/hooks/matiere/useMatiere.ts
import { useEffect, useState, useCallback } from 'react';
import { matiereService } from '../../services/matiereService';
import { Matiere } from '../../utils/types/data';

export default function useMatieres() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatieres = useCallback(async () => {
    try {
      setLoading(true);
      const matieresData = await matiereService.getAll();
      setMatieres(matieresData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMatiere = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newMatiere = await matiereService.create(data);
      setMatieres(prev => [...prev, newMatiere]);
      return newMatiere;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMatiere = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await matiereService.update(id, data);
      setMatieres(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMatiere = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await matiereService.delete(id);
      setMatieres(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteManyMatieres = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      const result = await matiereService.deleteMany(ids);
      setMatieres(prev => prev.filter(m => !ids.includes(m.id)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionnel : obtenir les matières par niveau de classe
  const getByNiveauClasse = useCallback(async (niveauClasseId: string) => {
    try {
      return await matiereService.getByNiveauClasse(niveauClasseId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadMatieres();
  }, [loadMatieres]);

  return {
    matieres,
    loading,
    error,
    loadMatieres,
    createMatiere,
    updateMatiere,
    deleteMatiere,
    deleteManyMatieres,
    getByNiveauClasse
  };
}