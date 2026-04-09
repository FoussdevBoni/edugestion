// src/hooks/evaluations/useEvaluations.ts
import { useEffect, useState, useCallback } from 'react';
import { evaluationService } from '../../services/evaluationService';
import { Evaluation } from '../../utils/types/data';

export default function useEvaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      const evaluationsData = await evaluationService.getAll();
      setEvaluations(evaluationsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvaluation = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newEvaluation = await evaluationService.create(data);
      setEvaluations(prev => [...prev, newEvaluation]);
      return newEvaluation;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvaluation = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await evaluationService.update(id, data);
      setEvaluations(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvaluation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await evaluationService.delete(id);
      setEvaluations(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtenir les évaluations par période (utilise maintenant le service)
  const getByPeriode = useCallback(async (periodeId: string) => {
    try {
      return await evaluationService.getByPeriode(periodeId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  // Obtenir les évaluations par niveau scolaire
  const getByNiveauScolaire = useCallback(async (niveauScolaireId: string) => {
    try {
      return await evaluationService.getByNiveauScolaire(niveauScolaireId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  return {
    evaluations,
    loading,
    error,
    loadEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getByPeriode,
    getByNiveauScolaire
  };
}