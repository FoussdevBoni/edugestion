// src/services/matiereService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseMatiere } from "../utils/types/base";
import { Matiere } from "../utils/types/data";

interface DeleteManyResult {
  success: boolean;
  deletedCount: number;
}

export const matiereService = {
  async getAll(): Promise<Matiere[]> {
    return await invokeIpc('matiere:getAll');
  },

  async getById(id: string): Promise<Matiere | null> {
    return await invokeIpc('matiere:getById', id);
  },

  async getByNiveauClasse(niveauClasseId: string): Promise<Matiere[]> {
    return await invokeIpc('matiere:getByNiveauClasse', niveauClasseId);
  },

  async create(payload: BaseMatiere): Promise<Matiere> {
    return await invokeIpc('matiere:create', payload);
  },

  async update(id: string, payload: Partial<BaseMatiere>): Promise<Matiere> {
    return await invokeIpc('matiere:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('matiere:delete', id);
  },

  async deleteMany(ids: string[]): Promise<DeleteManyResult> {
    return await invokeIpc('matiere:deleteMany', ids);
  }
};