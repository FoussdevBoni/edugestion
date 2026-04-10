// src/hooks/classe/useClasse.ts
import { useEffect, useState, useCallback } from 'react';
import { classeService } from '../../services/classeService';
import { Classe } from '../../utils/types/data';
import { useEcoleNiveau } from '../filters/useEcoleNiveau';
import { filterByCycleAndNiveau } from '../../shared/filterByCycleAndNiveau';



export default function useClasses() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau()


  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      const classesData = await classeService.getAll();

      const filtreredData = filterByCycleAndNiveau(cycleSelectionne , niveauSelectionne, classesData)
      setClasses(filtreredData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [niveauSelectionne , cycleSelectionne]);

  const createClasse = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newClasse = await classeService.create(data);
      setClasses(prev => [...prev, newClasse]);
      return newClasse;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClasse = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await classeService.update(id, data);
      setClasses(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClasse = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await classeService.delete(id);
      setClasses(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteManyClasses = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      const result = await classeService.deleteMany(ids);
      setClasses(prev => prev.filter(c => !ids.includes(c.id)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Méthodes de filtrage (optionnelles, si besoin)
  const getClassesByNiveauClasse = useCallback(async (niveauClasseId: string) => {
    try {
      return await classeService.getByNiveauClasse(niveauClasseId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  return {
    classes,
    loading,
    error,
    loadClasses,
    createClasse,
    updateClasse,
    deleteClasse,
    deleteManyClasses,
    getClassesByNiveauClasse
  };
}