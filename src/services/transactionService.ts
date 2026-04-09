// src/services/transactionService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseTransaction } from "../utils/types/base";
import { Transaction } from "../utils/types/data";

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    return await invokeIpc('transaction:getAll');
  },

  async getById(id: string): Promise<Transaction | null> {
    return await invokeIpc('transaction:getById', id);
  },

  async getByType(type: 'entree' | 'sortie'): Promise<Transaction[]> {
    return await invokeIpc('transaction:getByType', type);
  },

  async create(data: BaseTransaction): Promise<Transaction> {
    return await invokeIpc('transaction:create', data);
  },

  async update(id: string, data: Partial<BaseTransaction>): Promise<Transaction> {
    return await invokeIpc('transaction:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('transaction:delete', id);
  },

  async getByPeriode(dateDebut: string, dateFin: string): Promise<Transaction[]> {
    const transactions = await this.getAll();
    return transactions.filter(t => t.date >= dateDebut && t.date <= dateFin);
  },

  async getSolde(): Promise<{ totalEntrees: number; totalSorties: number; solde: number }> {
    const transactions = await this.getAll();
    const totalEntrees = transactions
      .filter(t => t.type === 'entree')
      .reduce((sum, t) => sum + t.montant, 0);
    const totalSorties = transactions
      .filter(t => t.type === 'sortie')
      .reduce((sum, t) => sum + t.montant, 0);
    
    return {
      totalEntrees,
      totalSorties,
      solde: totalEntrees - totalSorties
    };
  }
};