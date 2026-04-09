// src/services/paiementService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BasePaiement } from "../utils/types/base";
import { Paiement } from "../utils/types/data";

export const paiementService = {
  // Nouvelle méthode avec filtres dynamiques
  async getData(where?: Record<string, any>, options?: Record<string, any>): Promise<Paiement[]> {
    return await invokeIpc('paiement:getData', where, options);
  },

  // Garder pour compatibilité
  async getAll(): Promise<Paiement[]> {
    return await invokeIpc('paiement:getAll');
  },

  async getById(id: string): Promise<Paiement | null> {
    return await invokeIpc('paiement:getById', id);
  },

  async create(data: BasePaiement): Promise<Paiement> {
    return await invokeIpc('paiement:create', data);
  },

  async update(id: string, data: Partial<BasePaiement>): Promise<Paiement> {
    return await invokeIpc('paiement:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('paiement:delete', id);
  },

  async getByPeriode(dateDebut: string, dateFin: string): Promise<Paiement[]> {
    const paiements = await this.getAll();
    return paiements.filter(p => p.datePayement >= dateDebut && p.datePayement <= dateFin);
  },

  async getTotalParInscription(inscriptionId: string): Promise<number> {
    const paiements = await this.getData({ inscriptionId });
    return paiements.reduce((sum, p) => sum + p.montantPaye, 0);
  }
};