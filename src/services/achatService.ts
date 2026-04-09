// src/services/achatService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseAchat } from "../utils/types/base";
import { Achat } from "../utils/types/data";

export const achatService = {
  async getAll(): Promise<Achat[]> {
    return await invokeIpc('achat:getAll');
  },

  async getById(id: string): Promise<Achat | null> {
    return await invokeIpc('achat:getById', id);
  },

  async create(data: BaseAchat): Promise<Achat> {
    return await invokeIpc('achat:create', data);
  },

  async update(id: string, data: Partial<BaseAchat>): Promise<Achat> {
    return await invokeIpc('achat:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('achat:delete', id);
  },

  async getByMateriel(materielId: string): Promise<Achat[]> {
    const achats = await this.getAll();
    return achats.filter(a => a.materielId === materielId);
  },

  async getByPeriode(dateDebut: string, dateFin: string): Promise<Achat[]> {
    const achats = await this.getAll();
    return achats.filter(a => a.date >= dateDebut && a.date <= dateFin);
  }
};