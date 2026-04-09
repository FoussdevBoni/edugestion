// src/hooks/enseignant/useEnseignant.ts
import { useEffect, useState, useCallback } from 'react';
import { enseignantService } from '../../services/enseignantService';
import { Enseignant } from '../../utils/types/data';
import { BaseEnseignant } from '../../utils/types/base';

export default function useEnseignants() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les enseignants
  const loadEnseignants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await enseignantService.getAll();
      setEnseignants(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un enseignant par ID
  const getEnseignantById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      return await enseignantService.getById(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un enseignant
  const createEnseignant = useCallback(async (data: BaseEnseignant) => {
    try {
      setLoading(true);
      const newEns = await enseignantService.create(data);
      setEnseignants(prev => [...prev, newEns]);
      return newEns;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un enseignant
  const updateEnseignant = useCallback(async (id: string, data: Partial<BaseEnseignant>) => {
    try {
      setLoading(true);
      const updated = await enseignantService.update(id, data);
      setEnseignants(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un enseignant
  const deleteEnseignant = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await enseignantService.delete(id);
      setEnseignants(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rechercher des enseignants (délégué au backend)
  const searchEnseignants = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await enseignantService.search(searchTerm);
      return results;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrer par matière (backend)
  const getEnseignantsByMatiere = useCallback(async (matiereId: string) => {
    try {
      setLoading(true);
      return await enseignantService.getByMatiere(matiereId);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrer par classe (backend)
  const getEnseignantsByClasse = useCallback(async (classeId: string) => {
    try {
      setLoading(true);
      return await enseignantService.getByClasse(classeId);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnseignants();
  }, [loadEnseignants]);

  return {
    enseignants,
    loading,
    error,
    loadEnseignants,
    getEnseignantById,
    createEnseignant,
    updateEnseignant,
    deleteEnseignant,
    searchEnseignants,
    getEnseignantsByMatiere,
    getEnseignantsByClasse
  };
}