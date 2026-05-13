// src/hooks/stats/useStats.ts
import { useState, useCallback } from 'react';
import { statsService, StatsComptabilite, StatsStock, StatsDashboard } from '../../services/statsService';
import { alertServerError } from '../../helpers/alertError';
import { useEcoleNiveau } from '../filters/useEcoleNiveau';
import useNiveauxScolaires from '../niveauxScolaires/useNiveauxScolaires';

export default function useStats() {
  const [loading, setLoading] = useState(false);
  const [statsCompta, setStatsCompta] = useState<StatsComptabilite | null>(null);
  const [statsStock, setStatsStock] = useState<StatsStock | null>(null);
  const [statsDashboard, setStatsDashboard] = useState<StatsDashboard | null>(null);
  const { niveauSelectionne } = useEcoleNiveau()
  const { niveauxScolaires } = useNiveauxScolaires()
  const getComptabilite = useCallback(async (periode?: { debut?: string; fin?: string }) => {
    setLoading(true);
    try {
      const data = await statsService.getComptabilite(periode);
      setStatsCompta(data);
      return data;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStock = useCallback(async () => {
    setLoading(true);
    try {
      const data = await statsService.getStock();
      setStatsStock(data);
      return data;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboard = useCallback(async () => {
    setLoading(true);
    try {

      const data = await statsService.getDashboard({ niveauScolaire: niveauSelectionne });
      setStatsDashboard(data);
      return data;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [niveauSelectionne]);

  return {
    loading,
    statsCompta,
    statsStock,
    statsDashboard,
    getComptabilite,
    getStock,
    getDashboard
  };
}