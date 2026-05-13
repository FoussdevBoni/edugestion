// src/services/venteService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseVente } from "../utils/types/base";
import { Vente } from "../utils/types/data";

export const venteService = {
  async getAll(): Promise<Vente[]> {
    return await invokeIpc('vente:getAll');
  },

  async getById(id: string): Promise<Vente | null> {
    return await invokeIpc('vente:getById', id);
  },

  async create(data: BaseVente): Promise<Vente> {
    return await invokeIpc('vente:create', data);
  },

  async createMany(dataList: BaseVente[]): Promise<Vente[]> {
    return await invokeIpc('vente:createMany', dataList);
  },

  async update(id: string, data: Partial<BaseVente>): Promise<Vente> {
    return await invokeIpc('vente:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('vente:delete', id);
  },

  async getByMateriel(materielId: string): Promise<Vente[]> {
    const ventes = await this.getAll();
    return ventes.filter(v => v.materielId === materielId);
  },

  async getByEleve(eleveId: string): Promise<Vente[]> {
    const ventes = await this.getAll();
    return ventes.filter(v => v.eleveId === eleveId);
  },

  async getByPeriode(dateDebut: string, dateFin: string): Promise<Vente[]> {
    const ventes = await this.getAll();
    return ventes.filter(v => v.date >= dateDebut && v.date <= dateFin);
  }
};