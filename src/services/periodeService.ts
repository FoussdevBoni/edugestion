// src/services/periodeService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BasePeriode } from "../utils/types/base";
import { Periode } from "../utils/types/data";



export const periodeService = {
  async getAll(): Promise<Periode[]> {
    return await invokeIpc('periode:getAll');
  },

  async getById(id: string): Promise<Periode | null> {
    return await invokeIpc('periode:getById', id);
  },

  async getByNiveauScolaire(niveauScolaireId: string): Promise<Periode[]> {
    return await invokeIpc('periode:getByNiveauScolaire', niveauScolaireId);
  },

  async getByAnneeScolaire(anneeScolaire: string): Promise<Periode[]> {
    return await invokeIpc('periode:getByAnneeScolaire', anneeScolaire);
  },

  async create(payload: BasePeriode): Promise<Periode> {
    return await invokeIpc('periode:create', payload);
  },

  async update(id: string, payload: Partial<BasePeriode>): Promise<Periode> {
    return await invokeIpc('periode:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('periode:delete', id);
  }
};