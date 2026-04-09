// src/hooks/stats/useStats.ts
import { useState, useCallback } from 'react';
import { statsService, StatsComptabilite, StatsStock, StatsDashboard } from '../../services/statsService';
import { alertServerError } from '../../helpers/alertError';

export default function useStats() {
  const [loading, setLoading] = useState(false);
  const [statsCompta, setStatsCompta] = useState<StatsComptabilite | null>(null);
  const [statsStock, setStatsStock] = useState<StatsStock | null>(null);
  const [statsDashboard, setStatsDashboard] = useState<StatsDashboard | null>(null);

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
      const data = await statsService.getDashboard();
      setStatsDashboard(data);
      return data;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

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