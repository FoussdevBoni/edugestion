// src/services/materielService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { Materiel } from "../utils/types/data";

export const materielService = {
  async getAll(): Promise<Materiel[]> {
    return await invokeIpc('materiel:getAll');
  },

  async getById(id: string): Promise<Materiel | null> {
    return await invokeIpc('materiel:getById', id);
  },

  async create(data: Partial<Materiel>): Promise<Materiel> {
    return await invokeIpc('materiel:create', data);
  },

  async update(id: string, data: Partial<Materiel>): Promise<Materiel> {
    return await invokeIpc('materiel:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('materiel:delete', id);
  },

  async getStockBas(seuil: number = 10): Promise<Materiel[]> {
    const materiels = await this.getAll();
    return materiels.filter(m => m.quantite < seuil);
  }
};