// src/services/chargeService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseCharge } from "../utils/types/base";
import { Charge } from "../utils/types/data";

export const chargeService = {
  async getAll(): Promise<Charge[]> {
    return await invokeIpc('charge:getAll');
  },

  async getById(id: string): Promise<Charge | null> {
    return await invokeIpc('charge:getById', id);
  },

  async create(data: BaseCharge): Promise<Charge> {
    return await invokeIpc('charge:create', data);
  },

  async update(id: string, data: Partial<BaseCharge>): Promise<Charge> {
    return await invokeIpc('charge:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('charge:delete', id);
  },

  async getByCategorie(categorie: string): Promise<Charge[]> {
    const charges = await this.getAll();
    return charges.filter(c => c.categorie === categorie);
  },

  async getByPeriode(dateDebut: string, dateFin: string): Promise<Charge[]> {
    const charges = await this.getAll();
    return charges.filter(c => c.date >= dateDebut && c.date <= dateFin);
  },

  async getTotalParCategorie(): Promise<Record<string, number>> {
    const charges = await this.getAll();
    return charges.reduce((acc, charge) => {
      acc[charge.categorie] = (acc[charge.categorie] || 0) + charge.montant;
      return acc;
    }, {} as Record<string, number>);
  }
};