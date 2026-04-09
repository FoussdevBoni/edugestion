// src/services/classeService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseClasse } from "../utils/types/base";
import { Classe } from "../utils/types/data";

interface DeleteManyResult {
  success: boolean;
  deletedCount: number;
}

export const classeService = {
  async getAll(): Promise<Classe[]> {
    return await invokeIpc('classe:getAll');
  },

  async getById(id: string): Promise<Classe | null> {
    return await invokeIpc('classe:getById', id);
  },

  async getByNiveauClasse(niveauClasseId: string): Promise<Classe[]> {
    return await invokeIpc('classe:getByNiveauClasse', niveauClasseId);
  },

  async create(payload: BaseClasse): Promise<Classe> {
    return await invokeIpc('classe:create', payload);
  },

  async createMany(payload: BaseClasse[]): Promise<Classe[]> {
    return await invokeIpc('classe:createMany', payload);
  },

  async update(id: string, payload: Partial<BaseClasse>): Promise<Classe> {
    return await invokeIpc('classe:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('classe:delete', id);
  },

  async deleteMany(ids: string[]): Promise<DeleteManyResult> {
    return await invokeIpc('classe:deleteMany', ids);
  }
};