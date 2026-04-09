import { invokeIpc } from "../utils/invokeIpc";

// src/services/seanceService.ts
import { BaseSeance } from "../utils/types/base";
import { Seance } from "../utils/types/data";


export const seanceService = {
  async getAll(): Promise<Seance[]> {
    return await invokeIpc('seance:getAll');
  },

  async getById(id: string): Promise<Seance | null> {
    return await invokeIpc('seance:getById', id);
  },

  async getByClasse(classeId: string): Promise<Seance[]> {
    return await invokeIpc('seance:getByClasse', classeId);
  },

  async getByEnseignant(enseignantId: string): Promise<Seance[]> {
    return await invokeIpc('seance:getByEnseignant', enseignantId);
  },

  async getByJour(jour: string): Promise<Seance[]> {
    return await invokeIpc('seance:getByJour', jour);
  },

  async create(payload: BaseSeance): Promise<Seance> {
    return await invokeIpc('seance:create', payload);
  },

  async update(id: string, payload: Partial<BaseSeance>): Promise<Seance> {
    return await invokeIpc('seance:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('seance:delete', id);
  }
};