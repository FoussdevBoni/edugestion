// src/services/enseignantService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseEnseignant } from "../utils/types/base";
import { Enseignant } from "../utils/types/data";

export const enseignantService = {
  async getAll(): Promise<Enseignant[]> {
    // Le backend retourne déjà les données enrichies
    return await invokeIpc('enseignant:getAll');
  },

  async getById(id: string): Promise<Enseignant | null> {
    return await invokeIpc('enseignant:getById', id);
  },

  async create(payload: BaseEnseignant): Promise<Enseignant> {
    return await invokeIpc('enseignant:create', payload);
  },

  async update(id: string, payload: Partial<BaseEnseignant>): Promise<Enseignant> {
    return await invokeIpc('enseignant:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('enseignant:delete', id);
  },

  async getByMatiere(matiereId: string): Promise<Enseignant[]> {
    return await invokeIpc('enseignant:getByMatiere', matiereId);
  },

  async getByClasse(classeId: string): Promise<Enseignant[]> {
    return await invokeIpc('enseignant:getByClasse', classeId);
  },

  async search(searchTerm: string): Promise<Enseignant[]> {
    return await invokeIpc('enseignant:search', searchTerm);
  }
};