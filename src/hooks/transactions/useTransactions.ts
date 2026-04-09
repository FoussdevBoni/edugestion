// src/hooks/transaction/useTransaction.ts
import { useEffect, useState, useCallback } from 'react';
import { transactionService } from '../../services/transactionService';
import { Transaction } from '../../utils/types/data';

export default function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newTransaction = await transactionService.create(data);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await transactionService.update(id, data);
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getByType = useCallback(async (type: 'entree' | 'sortie') => {
    try {
      return await transactionService.getByType(type);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  const getSolde = useCallback(async () => {
    try {
      return await transactionService.getSolde();
    } catch (err: any) {
      setError(err.message);
      return { totalEntrees: 0, totalSorties: 0, solde: 0 };
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getByType,
    getSolde
  };
}