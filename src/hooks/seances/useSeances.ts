// src/hooks/seances/useSeances.ts
import { useEffect, useState, useCallback } from 'react';
import { seanceService } from '../../services/seanceService';
import { Seance } from '../../utils/types/data';

export default function useSeances() {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeances = useCallback(async () => {
    try {
      setLoading(true);
      const seancesData = await seanceService.getAll();
      setSeances(seancesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSeance = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newSeance = await seanceService.create(data);
      setSeances(prev => [...prev, newSeance]);
      return newSeance;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSeance = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await seanceService.update(id, data);
      setSeances(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSeance = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await seanceService.delete(id);
      setSeances(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer l'emploi du temps d'une classe
  const getEmploiParClasse = useCallback(async (classeId: string) => {
    try {
      return await seanceService.getByClasse(classeId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  // Récupérer l'emploi du temps d'un enseignant
  const getEmploiParEnseignant = useCallback(async (enseignantId: string) => {
    try {
      return await seanceService.getByEnseignant(enseignantId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  // Organiser par jour (fonction utilitaire pure)
  const getEmploiParJour = useCallback((seancesList: Seance[]) => {
    const jours = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return jours.map(jour => ({
      jour,
      seances: seancesList
        .filter(s => s.jour === jour)
        .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
    }));
  }, []);

  useEffect(() => {
    loadSeances();
  }, [loadSeances]);

  return {
    seances,
    loading,
    error,
    loadSeances,
    createSeance,
    updateSeance,
    deleteSeance,
    getEmploiParClasse,
    getEmploiParEnseignant,
    getEmploiParJour
  };
}